import { IDetailTaxon, Taxon } from "@hera/data";
import { useQuery } from "react-query";

export const GET_LIST_DETAIL_TAXON = "GET_LIST_DETAIL_TAXON";
export function useGetListDetailTaxon(
  slug: string,
  taxonDetails?: IDetailTaxon,
) {
  return useQuery({
    queryKey: [GET_LIST_DETAIL_TAXON, slug],
    queryFn() {
      return Taxon.getListDetailTaxon(slug);
    },
    initialData: taxonDetails,
  });
}
