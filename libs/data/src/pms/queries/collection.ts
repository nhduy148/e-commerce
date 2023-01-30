import {
  getCollectionListService,
  getCollectionsService,
  ICollection,
  IHttpError,
  IResponse,
} from "@hera/data";
import { useQuery } from "react-query";

export const LIST_COLLECTIONS_KEY = "LIST_COLLECTIONS_KEY";
export function useListCollectionsQuery() {
  return useQuery<ICollection, IHttpError>({
    queryKey: [LIST_COLLECTIONS_KEY],
    queryFn: getCollectionListService,
  });
}

export const LIST_COLLECTIONS_KEY_2 = "LIST_COLLECTIONS_KEY_2";
export function useGetCollectionsQuery() {
  return useQuery<IResponse<ICollection[]>, IHttpError>({
    queryKey: [LIST_COLLECTIONS_KEY_2],
    queryFn: getCollectionsService,
  });
}
