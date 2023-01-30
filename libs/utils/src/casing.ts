import camelCase from "lodash-es/camelCase";
import snakeCase from "lodash-es/snakeCase";
import transform from "lodash-es/transform";

// @ts-ignore
export function toCamelCase<T, TResult>(obj: T): TResult {
  //@ts-ignore
  return transform<T, TResult>(obj, (acc, value, key, target) => {
    //@ts-ignore
    const camelKey = Array.isArray(target) ? key : camelCase(key);

    //@ts-ignore
    acc[camelKey] =
      typeof value === "object" && value !== null ? toCamelCase(value) : value;
  });
}

// @ts-ignore
export const toSnakeCase = (obj) => {
  return transform(obj, (acc, value, key, target) => {
    //@ts-ignore
    const snake = Array.isArray(target) ? key : snakeCase(key);

    //@ts-ignore
    acc[snake] =
      typeof value === "object" && value !== null ? toSnakeCase(value) : value;
  });
};
