import { useQuery } from "react-query";
import { IHttpError } from "../../core";
import { Category } from "../models/category";

export const LIST_CATEGORY_KEY = "LIST_CATEGORY_KEY";
export function useListCategories() {
  return useQuery<any, IHttpError>({
    queryKey: [LIST_CATEGORY_KEY],
    queryFn() {
      return Category.objects.find();
    },
  });
}
