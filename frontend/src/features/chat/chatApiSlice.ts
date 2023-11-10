import { apiSlice } from "../../app/api/apiSlice";
import { IFile } from "../../types/file";
import { IUser } from "../../types/user";

export interface IMessage {
  content: string;
  _id: string;
  createdAt: string;
  sender: IUser;
  files: Array<IFile>;
  isRead: boolean;
}

export interface IMessageResult {
  pages: number;
  messages: IMessage[];
  total: number;
}

export interface IChat {
  _id: string;
  latestMessage: IMessage;
  participants: Array<IUser>;
}

export interface IChatResult {
  pages: number;
  chats: IChat[];
  total: number;
}

export interface IFilter {
  page: number;
  itemsPerPage: number;
  id?: string;
}

export const chatApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //builder.query(ResultType, QueryArgType | void)
    //get chats
    getChats: builder.query<IChatResult, IFilter>({
      query: ({ itemsPerPage, page }) => ({
        url: `/chats?page=${page}&size=${itemsPerPage}`,
      }),
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
      providesTags: (result, error, arg) =>
        result?.chats?.length
          ? [
              ...result.chats.map(({ _id: id }) => ({
                type: "Chat" as const,
                id,
              })),
              { type: "Chat", id: "LIST" },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
            [{ type: "Chat", id: "LIST" }],
    }),

    //messages for a given chat
    getMessages: builder.query<IMessageResult, IFilter>({
      query: ({ itemsPerPage, page, id }) => ({
        url: `/chats/${id}?page=${page}&size=${itemsPerPage}`,
      }),
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
      providesTags: (result, error, arg) =>
        result?.messages?.length
          ? [
              ...result.messages.map(({ _id: id }) => ({
                type: "Message" as const,
                id,
              })),
              { type: "Message", id: "LIST" },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
            [{ type: "Message", id: "LIST" }],
    }),

    //post message
    postMessage: builder.mutation<{ message: IMessage }, FormData>({
      query: (data) => ({
        url: `/chats/messages`,
        method: "POST",
        body: data,
      }),
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
      //refetch or invalidate cache
      // invalidatesTags: (result, error, arg) => [
      //   { type: "Message", id: "LIST" },
      // ],
    }),

    //mark recipient unread messages as read
    markAsRead: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/chats/messages/${id}`,
        method: "PATCH",
      }),
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
      // don;t refetch writer chats as you can't see other user's isRead status, only yours
      //invalidate/refetch unread to clear notifications(after isRead of the other user is updated)
     // invalidatesTags: (result, error, id) => [{ type: "Message", id }],
    }),

    //delete chat
    deleteMessage: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/chats/messages/${id}`,
        method: "DELETE",
      }),
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
      //invalidatesTags: (result, error, id) => [{ type: "Message", id }], //provide List to trigger unread & recent chats
    }),
  }),

  overrideExisting: true,
});

export const {
  useGetMessagesQuery,
  useMarkAsReadMutation,
  usePostMessageMutation,
  useDeleteMessageMutation,
  useGetChatsQuery,
} = chatApiSlice;
