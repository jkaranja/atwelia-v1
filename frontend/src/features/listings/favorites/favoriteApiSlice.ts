import { apiSlice } from "../../../app/api/apiSlice";
import { IListing, IListingFilter } from "../../../types/listing";

export interface IFavorite {
  _id: string;
  listing: IListing;
}

export interface IFavoriteResult {
  pages: number;
  favorites: Array<IFavorite>;
  total: number;
}

export const favoriteApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //builder.query(ResultType, QueryArgType | void)
    getFavorites: builder.query<IFavoriteResult, IListingFilter | void>({
      query: (filters) => ({
        url: `/listings/favorites?page=${filters?.page || 1}&size=${
          filters?.itemsPerPage || 50 //max of 50 favorite
        }`,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
        } catch {
          //no listings, clear any data in cache for this endpoint + query params
          dispatch(
            favoriteApiSlice.util.updateQueryData(
              "getFavorites",
              args,
              (draft) => {
                if (!draft?.favorites) return;
                draft.favorites.length = 0;
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
        result?.favorites?.length
          ? [
              ...result.favorites.map(({ _id: id }) => ({
                type: "Favorite" as const,
                id,
              })),
              { type: "Favorite", id: "LIST" },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
            [{ type: "Favorite", id: "LIST" }], //if initially fetch returned 'no record found' error
    }),
    //add to wish list
    AddFavorite: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/listings/favorites/add/${id}`,
        method: "PATCH",
      }),

      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
      //refetch after new record is added
      invalidatesTags: (result, error, arg) => [
        { type: "Favorite", id: "LIST" },
      ],
    }),

    //remove from favorite
    removeFavorite: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/listings/favorites/remove/${id}`,
        method: "PATCH",
      }),

      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
      //refetch after new record is added
      invalidatesTags: (result, error, id) => [{ type: "Favorite", id }],
    }),
  }),

  overrideExisting: true,
});

export const {
  useGetFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} = favoriteApiSlice;
