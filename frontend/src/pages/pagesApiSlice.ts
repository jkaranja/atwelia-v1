import { apiSlice } from "../app/api/apiSlice";

export const pagesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //post message
    postMessage: builder.mutation<
      { message: string },
      { data: { email: string; name: string; message: string } }
    >({
      query: ({ data }) => ({
        url: `/contact`,
        method: "POST",
        body: data,
      }),
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
      //   //refetch after new record is added
      //   invalidatesTags: (result, error, arg) => [{ type: "Note", id: "LIST" }],
    }),
  }),
});

export const { usePostMessageMutation } = pagesApiSlice;
