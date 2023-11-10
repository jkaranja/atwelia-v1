import { apiSlice } from "../../../app/api/apiSlice";
import { IListing, IListingResult } from "../../../types/listing";
import { IUser } from "../../../types/user";



const providesList = (id: string) => {
  //defined tag types in apiSlice
  //must use const assertion here to prevent the type being broadened to string as it each entry should be present in tuple defined in apiSlice
  const tagTypes = ["Listing"] as const;

  return tagTypes.map((tagType) => ({ type: tagType, id }));
};

export const viewApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //builder.query(ResultType, QueryArgType | void)

    //get Related listing
    getRelatedListings: builder.query<IListing[], string>({
      query: (id) => ({
        url: `/listings/related/${id}`,
      }),

      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,

      providesTags: (result, error, arg) =>
        // is result available?//data from db form = {pages, orders[]}
        result?.length
          ? [
              ...result.map(({ _id: id }) => ({
                type: "Rental" as const,
                id,
              })),
              { type: "Rental", id: "LIST" },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
            [{ type: "Rental", id: "LIST" }], //if initially fetch returned 'no record found' error
    }),

    //view listing
    getListing: builder.query<IListing, string>({
      query: (id) => ({
        url: `/listings/view/${id}`,
      }),

      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,

      providesTags: (result, error, id) => providesList(id),
    }),
  }),

  overrideExisting: true,
});

export const { useGetListingQuery, useGetRelatedListingsQuery } = viewApiSlice;
