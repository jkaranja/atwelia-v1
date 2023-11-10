import { apiSlice } from "../../app/api/apiSlice";
import { TourStatus } from "../../types/tour";
import { IUser } from "../../types/user";

export interface INotificationMessage {
  title: string;
  chat: string;
  tour: string;
  createdAt: Date;
  tourStatus: TourStatus;
  _id: string;
}

export interface INotificationResult {
  _id: string;
  user: IUser;
  pushToken: string;
  tours: INotificationMessage[]; //INotificationMessage[]
  inbox: INotificationMessage[];
}

export const notificationsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //fetch Orders //ResultType > QueryArg (passes type to query: (arg: this arg))
    getNotifications: builder.query<INotificationResult, void>({
      query: () => ({
        url: `/notifications`,
      }),

      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,

      providesTags: (result, error, arg) => [
        { type: "Notification", id: "LIST" },
      ],
    }),

    //clear tour notifications
    clearTours: builder.mutation<{ message: string }, { tourStatus: string }>({
      query: (data) => ({
        url: `/notifications`,
        method: "PATCH",
        body: data,
      }),
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
      //refetch or invalidate cache
      invalidatesTags: (result, error, arg) => [
        { type: "Notification", id: "LIST" },
      ],
    }),

    //clear inbox notifications
    clearInbox: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: "PATCH",
      }),
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
      //refetch or invalidate cache
      invalidatesTags: (result, error, arg) => [
        { type: "Notification", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useClearInboxMutation,
  useClearToursMutation,
  useGetNotificationsQuery,
} = notificationsApiSlice;
