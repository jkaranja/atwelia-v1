import { apiSlice } from "../../app/api/apiSlice";
import { ITourFilter, ITourResult } from "../../types/tour";

export const tourApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //builder.query(ResultType, QueryArgType | void)
    getAgentTours: builder.query<ITourResult, ITourFilter>({
      query: ({ itemsPerPage, page, filters }) => ({
        url: `/tours/agents?page=${page}&size=${itemsPerPage}&filters=${JSON.stringify(
          filters
        )}`,
      }),

      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
        } catch {
          //no tours, clear any data in cache for this endpoint + query params
          dispatch(
            tourApiSlice.util.updateQueryData(
              "getAgentTours",
              args,
              (draft) => {
                if (!draft?.tours) return;
                draft.tours.length = 0;
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
        result?.tours?.length
          ? [
              ...result.tours.map(({ _id: id }) => ({
                type: "Tour" as const,
                id,
              })),
              { type: "Tour", id: "LIST" },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
            [{ type: "Tour", id: "LIST" }], //if initially fetch returned 'no record found' error
    }),

    //confirm tour
    confirmTour: builder.mutation<
      { message: string },
      { id: string; tourDate: Date }
    >({
      query: ({ id, ...data }) => ({
        url: `/tours/confirm/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
      //refetch or invalidate cache
      invalidatesTags: (result, error, arg) => [{ type: "Tour", id: arg.id }],
    }),

    //cancel tour
    cancelTour: builder.mutation<
      { message: string },
      { comment: string; id: string }
    >({
      query: ({ id, ...data }) => ({
        url: `/tours/cancel/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
      //refetch or invalidate cache
      invalidatesTags: (result, error, arg) => [{ type: "Tour", id: arg.id }],
    }),

    //Decline tour
    declineTour: builder.mutation<
      { message: string },
      { comment: string; id: string }
    >({
      query: ({ id, ...data }) => ({
        url: `/tours/decline/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
      //refetch or invalidate cache
      invalidatesTags: (result, error, arg) => [{ type: "Tour", id: arg.id }],
    }),

    //End tour
    endTour: builder.mutation<
      { message: string },
      { id: string; comment?: string; rating?: number }
    >({
      query: ({ id, ...data }) => ({
        url: `/tours/end/${id}`,
        method: "PATCH",
        body: data,
      }),
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
      //refetch or invalidate cache
      invalidatesTags: (result, error, arg) => [{ type: "Tour", id: arg.id }],
    }),

    //Delete tour
    removeTour: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/tours/${id}`,
        method: "DELETE",
      }),
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
      //refetch or invalidate cache
      invalidatesTags: (result, error, id) => [{ type: "Tour", id }],
    }),
  }),

  overrideExisting: true,
});

export const {
  useGetAgentToursQuery,
  useDeclineTourMutation,
  useConfirmTourMutation,
  useCancelTourMutation,
  useEndTourMutation,
} = tourApiSlice;
