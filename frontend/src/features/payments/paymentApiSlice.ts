import { apiSlice } from "../../app/api/apiSlice";
import { IListing, ILocation } from "../../types/listing";
import { ITour } from "../../types/tour";
import { IUser } from "../../types/user";

interface IFilterQuery {
  currentPage: number;
  itemsPerPage: number;
}

export interface IActivity {
  _id: string;
  user: string;
  amount: number;
  activityType: string;
  updatedAt: string;
}

export interface ICommission {
  _id: string;
  user: IUser;
  renter: IUser;
  amount: number;
  tour: ITour;
  status: string;
  listing: IListing;
  updatedAt: string;
}

interface IPaymentResult {
  pages: number;
  total: number;
}

interface IActivityResult extends IPaymentResult {
  activities: IActivity[];
}

interface ICommissionResult extends IPaymentResult {
  commissions: ICommission[];
  balance: number;
}

export const paymentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //builder.query(ResultType, QueryArgType | void)

    //get commissions
    getCommissions: builder.query<ICommissionResult, IFilterQuery>({
      query: ({ currentPage, itemsPerPage }) => ({
        url: `/payments/commissions?page=${currentPage}&size=${itemsPerPage}`,
      }),
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
      // providesTags: (result, error, arg) =>
      //   result?.total
      //     ? [
      //         ...result.commissions.map(({ _id: id }) => ({
      //           type: "Payment" as const,
      //           id,
      //         })),
      //         { type: "Payment", id: "LIST" },
      //       ]
      //     : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
      //       [{ type: "Payment", id: "LIST" }],
    }),

    //get activities
    getActivities: builder.query<IActivityResult, IFilterQuery>({
      query: ({ currentPage, itemsPerPage }) => ({
        url: `/payments/activities?page=${currentPage}&size=${itemsPerPage}`,
      }),
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
      // providesTags: (result, error, arg) =>
    }),
    //deposit /stk push
    deposit: builder.mutation<{ message: string }, { amount: number }>({
      query: (data) => ({
        url: `/payments/deposit`,
        method: "POST",
        body: data,
      }),
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
      //refetch or invalidate cache
      //invalidatesTags: (result, error, arg) => [{ type: "Payment", id: "LIST" }],
    }),
  }),
});

export const {
  useGetCommissionsQuery,
  useGetActivitiesQuery,
  useDepositMutation,
} = paymentApiSlice;
