import { apiSlice } from "../../../app/api/apiSlice";
import { IListing, IListingResult } from "../../../types/listing";

interface IListingFilter {
  page: number;
  itemsPerPage: number;
  filters: Partial<IListing> & { priceRange?: number[] };
}

export const rentalApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //builder.query(ResultType, QueryArgType | void)

    getAllListings: builder.query<IListingResult, IListingFilter>({
      query: ({ itemsPerPage, page, filters }) => ({
        url: `/listings/rentals?page=${page}&size=${itemsPerPage}&filters=${JSON.stringify(
          filters
        )}`,
      }),

      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,

      providesTags: (result, error, arg) =>
        // is result available?//data from db form = {pages, orders[]}
        result?.listings?.length
          ? [
              ...result.listings.map(({ _id: id }) => ({
                type: "Rental" as const,
                id,
              })),
              { type: "Rental", id: "LIST" },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
            [{ type: "Rental", id: "LIST" }], //if initially fetch returned 'no record found' error
    }),
  }),

  // overrideExisting: true,
});

export const { useGetAllListingsQuery } = rentalApiSlice;
