import { Collection, ICollection, IResponse } from "@hera/data";

export const getCollectionListService = () => {
  return Collection.objects.find();
};

export const getCollectionsService = () => {
  return Collection.service.get<IResponse<ICollection[]>>();
};
