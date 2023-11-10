import { apiSlice } from "../../../app/api/apiSlice";
import { IListingFilter, IListingResult } from "../../../types/listing";

export const listingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //builder.query(ResultType, QueryArgType | void)

    getListings: builder.query<IListingResult, IListingFilter>({
      query: ({ itemsPerPage, page, filters }) => ({
        url: `/listings?page=${page}&size=${itemsPerPage}&filters=${JSON.stringify(
          filters
        )}`,
      }),

      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
        } catch {
          //no listings, clear any data in cache for this endpoint + query params
          dispatch(
            listingApiSlice.util.updateQueryData(
              "getListings",
              args,
              (draft) => {
                if (!draft?.listings) return;
                draft.listings.length = 0;
                draft.total = 0;
                draft.pages = 0;
              }
            )
          );
        }
      },

      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,

      providesTags: (result, error, arg) =>
        // is result available?//data from db form = {pages, orders[]}
        result?.listings?.length
          ? [
              ...result.listings.map(({ _id: id }) => ({
                type: "Listing" as const,
                id,
              })),
              { type: "Listing", id: "LIST" },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
            [{ type: "Listing", id: "LIST" }], //if initially fetch returned 'no record found' error
    }),

    //listing//data is FormData object
    postNewListing: builder.mutation<{ message: string }, FormData>({
      query: (data) => ({
        url: `/listings/list`,
        method: "POST",       
        //fetchBaseQuery which uses Fetch API underneath will add the correct content-type from body
        body: data,
      }),

      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
      //refetch after new record is added
      invalidatesTags: (result, error, arg) => [
        { type: "Listing", id: "LIST" },
      ],
    }),

    //update order
    updateListing: builder.mutation<
      { message: string },
      { id: string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/listings/${id}`,
        method: "PUT",
        body: data,
      }),
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
      //refetch or invalidate cache
      invalidatesTags: (result, error, arg) => [
        { type: "Listing", id: arg.id },
      ],
    }),

    //update listing status
    updateStatus: builder.mutation<
      { message: string },
      { id: string; listingStatus: string }
    >({
      query: ({ id, ...data }) => ({
        url: `/listings/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
      //refetch or invalidate cache
      invalidatesTags: (result, error, arg) => [
        { type: "Listing", id: arg.id },
      ],
    }),

    //delete order
    deleteListing: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/listings/${id}`,
        method: "DELETE",
      }),
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
      //refetch or invalidate cache
      invalidatesTags: (result, error, id) => [{ type: "Listing", id }],
    }),
  }),

  // overrideExisting: true,
});

export const {
  useDeleteListingMutation,
  useGetListingsQuery,
  useUpdateStatusMutation,
  usePostNewListingMutation,
  useUpdateListingMutation,
} = listingApiSlice;
