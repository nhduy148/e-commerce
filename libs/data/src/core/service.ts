import * as config from "@hera/config";
import { resetStorageKey, toCamelCase, toSnakeCase } from "@hera/utils";
import axios, { Axios, AxiosRequestConfig, AxiosResponse } from "axios";
import camelCase from "lodash-es/camelCase";

export interface IInitData {
  endpoint: string;
  baseUrl: string;
}

interface IRequestParams {
  id?: string | number;
  url?: string;
  config?: AxiosRequestConfig;
}

interface IGetParams extends IRequestParams {
  params?: any;
  urlParams?: object;
}
interface IPostPatchParams extends IRequestParams {
  payload: any;
  urlParams?: object;
}

type IDeleteRequestParams = IRequestParams;

type IDeleteMultiRequestParams = {
  ids?: string[];
  url: string;
  config?: AxiosRequestConfig;
};

export interface IResponse<T> {
  data: T;
}

export interface IResponseWithStatus<T> {
  data: T;
  status: string;
}

export interface IPaginateData<T> {
  data: T[];
  paginate: IPaginate;
}

export interface IPaginate {
  hasNext?: boolean;
  hasPrev?: boolean;
  page: number;
  size: number;
  total: number;
  totalEntries: number;
  totalPages: number;
}

export interface IPaginationQuery {
  page?: number;
  size?: number;
}

export interface IPaginateResponse<T> {
  data: IPaginateData<T>;
}

export interface IServiceInterceptors {
  /**
   * The key which save the authentication information in localStorage
   */
  tokenKey: string;

  /**
   * Base API URL
   */
  baseUrl?: string;

  locale?: string;
}

export enum HttpCode {
  ERROR = "error",
  OK = "ok",
  CREATED = "created",
  ACCEPTED = "accepted",
  BAD_REQUEST = "bad_request",
  UNAUTHORIZED = "unautorized",
  PAYMENT_REQUIRED = "payment_required",
  FORBIDDEN = "forbidden",
  NOT_FOUND = "not_found",
  REQUEST_PARAMS_VALIDATION_FAILED = "request_param_validation_failed",
  CHANGESET_VALIDATE_FAILED = "changeset_validate_failed",
  METHOD_NOT_ALLOWED = "method_not_allowed",
  CHANNEL_NOT_FOUND = "channel_not_found",
  CHANNEL_CONNECTED = "channel_connected",
  INVALID_SERVER_DATA = "invalid_server_data",
  REGISTER_EMAIL_REQUIRED = "register_email_required",
}

export interface IHttpError {
  httpCode: number;
  message: string;
  errorCode?: string;
  statusCode?: string;
}

export class HttpError implements IHttpError {
  httpCode: number;
  message: string;
  errorCode?: string;
  statusCode?: string;
  constructor({ httpCode, message, errorCode, statusCode }: IHttpError) {
    this.httpCode = httpCode;
    this.message = message;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
  }
}

function getDefaultErrorMessage(locale?: string) {
  const unknownError = {
    en: "Unknown error, please try again later",
    vi: "Có lỗi xảy ra, xin hãy thử lại sau",
  };

  switch (locale) {
    case "en":
      return unknownError.en;
    case "vi":
      return unknownError.vi;
    default:
      return "Unknown error, please try again later";
  }
}

const isClient = typeof window !== "undefined";

function resolveResponse(response: AxiosResponse) {
  return response;
}

function rejectResponse(error: any) {
  let locale;
  if (isClient) locale = localStorage.getItem("OCTOSELLS_LOCALE");
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error

  const nextError: IHttpError = {
    httpCode: 500,
    message: getDefaultErrorMessage(locale || "vi"),
  };

  if (error?.response?.status === 401) {
    resetStorageKey();
    window.location.href = "/";
  }

  if (error.response) {
    nextError.httpCode = error.response.status;
  }
  if (error?.response?.data?.error) {
    nextError.errorCode = error.response.data.error;
  }
  if (error?.response?.data?.message) {
    nextError.message = error.response.data.message;
  }
  if (error?.response?.data?.status_code) {
    nextError.statusCode = error.response.data.status_code;
  }

  const errors = error?.response?.data?.errors;

  if (typeof errors === "object" && typeof errors !== null) {
    const str = Object.keys(errors)
      .map((key) => {
        if (Array.isArray(errors[key])) {
          return errors[key].join(", ");
        }
        return errors[key];
      })
      .filter((item) => typeof item === "string")
      .join("\n");
    if (str) {
      nextError.message = str;
    }
  }
  return Promise.reject(nextError);
}

export class Service {
  httpClient: () => Axios;

  endpoint: string;

  constructor({ endpoint, baseUrl }: IInitData) {
    this.endpoint = endpoint;

    this.httpClient = () => {
      let acceptLanguage;

      if (isClient) {
        acceptLanguage = localStorage.getItem(config.env.localeKey);
      }

      let headers = {};

      if (acceptLanguage) {
        headers = {
          ...headers,
          "Accept-Language": acceptLanguage as string,
        };
      }

      let authorization;
      let persistedAuth;
      if (isClient) {
        persistedAuth = localStorage.getItem(config.env.authKey);
      }

      if (persistedAuth) {
        authorization = `Bearer ` + JSON.parse(persistedAuth || "")?.token;
      }

      if (authorization) {
        headers = {
          ...headers,
          Authorization: authorization,
        };
      }

      // @ts-ignore

      const instance = axios.create({
        baseURL: baseUrl,
        headers: headers,
      });

      instance.interceptors.request.use((conf) => {
        conf.params = conf.params || {};
        conf.params["channel_code"] = config.env.channelCode;
        conf.params["t"] = new Date().getTime();
        return conf;
      });

      instance.interceptors.response.use(resolveResponse, rejectResponse);

      return instance;
    };
  }

  static interceptors({ tokenKey, locale }: IServiceInterceptors) {
    // Add a request interceptor
    axios.interceptors.request.use(
      function (config) {
        // @ts-ignore
        config.headers["Accept-Language"] = locale as string;

        return config;
      },
      function (error) {
        // Do something with request error
        return Promise.reject(error);
      },
    );

    // Add a response interceptor
    axios.interceptors.response.use(
      function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response;
      },
      function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        const nextError: IHttpError = {
          httpCode: 500,
          message: getDefaultErrorMessage(locale),
        };

        if (error.response && error.response.status) {
          if (error.response.status === 401) {
            resetStorageKey();
            window.location.href = "/";
          }
        }

        if (error.response) {
          nextError.httpCode = error.response.status;
        }

        if (error?.response?.data?.message) {
          nextError.message = error.response.data.message;
        }
        if (error?.response?.data?.status_code) {
          nextError.statusCode = error.response.data.status_code;
        }

        const errors = error?.response?.data?.errors;

        if (typeof errors === "object" && typeof errors !== null) {
          const str = Object.keys(errors)
            .map((key) => {
              if (Array.isArray(errors[key])) {
                return key + " " + errors[key].join(", ");
              }
              return key + " " + errors[key];
            })
            .filter((item) => typeof item === "string")
            .join("\n");
          if (str) {
            nextError.message = str;
          }
        }

        return Promise.reject(nextError);
      },
    );
  }

  /**
   * Make url for findOne and update method
   * @param id
   */
  makeOneUrl(id: string | number) {
    return (this.endpoint + "/").replace("//", "/") + id;
  }

  /**
   * To do url interpolation using colons as the delimiter
   */

  interpolateUrl(url: string, params: object) {
    url = url.replace("//", "/");
    var result: any[] = [];

    url.split("/:").forEach((segment, i) => {
      if (i === 0) {
        return result.push(segment);
      } else {
        var segmentMatch = segment.match(/(\w+)(?:[?*])?(.*)/);
        var key = camelCase(segmentMatch![1]);

        if (params[key as keyof typeof segmentMatch] !== undefined) {
          result.push("/" + params[key as keyof typeof segmentMatch]);
        } else {
          result.push("/:" + key);
        }

        result.push(segmentMatch![2] || "");
      }
    });

    return result.join("");
  }

  init({ endpoint }: IInitData) {
    this.endpoint = endpoint;
  }

  /**
   * Extract data from axios response
   * @param response axios response
   */
  resolve<T>(response: AxiosResponse<T>): T {
    return toCamelCase(response.data);
  }

  /**
   * Overwrite GET method
   * @param {IGetParams} configs
   * @param noConvertCase
   * @param downloadFile
   * @param noSnakeCase
   */
  get<T>(
    configs?: IGetParams,
    noConvertCase?: boolean,
    downloadFile?: boolean,
    noSnakeCase?: boolean,
  ) {
    const { url, params } = configs || {};
    const request = this.httpClient().get<T>(url || this.endpoint, {
      params: !noSnakeCase ? toSnakeCase(params) : params,
      responseType: downloadFile ? "blob" : undefined,
    });
    if (noConvertCase) {
      return request.then((res) => res.data);
    }
    return request.then(this.resolve);
  }

  /**
   * Overwrite GET method for one model
   * @param {IGetParams} configs
   */
  getOne<T>(configs?: IGetParams) {
    const { url, params, urlParams } = configs || {};

    const baseUrl: string = url || this.endpoint || "";
    let getUrl = baseUrl;
    if (urlParams && Object.keys(urlParams).length > 0) {
      getUrl = this.interpolateUrl(baseUrl, urlParams);
    }

    return this.httpClient()
      .get<T>(getUrl, { params: toSnakeCase(params) })
      .then(this.resolve);
  }

  /**
   * Overwrite POST method
   * @param url
   * @param params
   */
  post<T>(
    { url, payload, config, urlParams }: IPostPatchParams,
    isSnakeCase: boolean = true,
  ) {
    const baseUrl: string = url || this.endpoint || "";
    let postUrl = baseUrl;
    if (urlParams && Object.keys(urlParams).length > 0) {
      postUrl = this.interpolateUrl(baseUrl, urlParams);
    }
    const request = this.httpClient().post<T>(
      postUrl,
      isSnakeCase ? toSnakeCase(payload) : (payload as T),
      config,
    );
    if (config?.responseType === "blob") {
      return request.then((res) => res.data);
    }
    return request.then(this.resolve);
  }

  /**
   * Overwrite PATCH method
   * @param url
   * @param params
   */
  put<T>({ id, url, payload }: IPostPatchParams) {
    return this.httpClient()
      .put<T>(url || this.makeOneUrl(id as string), toSnakeCase(payload) as T)
      .then(this.resolve);
  }

  /**
   * Overwrite DELETE method
   * @param url
   * @param payload
   */
  delete<T>({ url, id }: IDeleteRequestParams) {
    return this.httpClient()
      .delete<T>(url || this.makeOneUrl(id as string))
      .then(this.resolve);
  }

  interpolateDelete<T>(url: string, params: object) {
    const deleteUrl = this.interpolateUrl(url, params);
    return this.httpClient().delete<T>(deleteUrl).then(this.resolve);
  }

  deleteMulti<T>({ url, ids }: IDeleteMultiRequestParams) {
    return this.httpClient()
      .delete<T>(url, {
        params: { ids },
      })
      .then(this.resolve);
  }

  /**
   * Upload
   * @param payload
   * @param {string} url
   * @return {Promise<T>}
   */
  upload<T>(payload: any, url?: string) {
    return this.httpClient()
      .post<T>(url || this.endpoint, payload, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then(this.resolve);
  }

  /**
   *  Upload
   * @param payload
   * @param {string} url
   * @return {Promise<T>}
   */
  uploadAvatar<T>(payload: any, url?: string) {
    return this.httpClient()
      .put<T>(url || this.endpoint, payload, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then(this.resolve);
  }
  /**
   * Upload single file
   * @param {File} file
   * @param {string} url
   * @return {Promise<T>}
   */
  uploadSingleFile<T>(file: File, url?: string) {
    const formData = new FormData();
    formData.append("file", file);
    return this.upload<T>(formData, url);
  }
}
