import { apiSlice } from "../../app/api/apiSlice";

import { IProfile, IUser } from "../../types/user";

const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //fetch User details
    getUser: builder.query<IUser, void>({
      query: () => ({
        url: `/users`,
        // validateStatus: (response, result) => {
        //   return response.status === 200 && !result.isError;
        // },
      }),
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
      providesTags: (result, error, id) => [{ type: "User", id: "USER" }],
    }),

    //Get profile
    getProfile: builder.query<IProfile, string>({
      query: (id) => ({
        url: `/users/profile/${id}`,
      }),
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
      providesTags: (result, error, id) => [{ type: "User", id: "PROFILE" }],
    }),
    //add new user
    registerUser: builder.mutation<{ accessToken: string }, Partial<IUser>>({
      query: (userInfo) => ({
        url: `/users/register`,
        method: "POST",
        body: userInfo,
      }),
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
      //refetch after new record is added
      // invalidatesTags: (result, error, arg) => [
      //   { type: "User", id: "PROFILE" },
      // ],
    }),

    //create agent profile
    createProfile: builder.mutation<{ message: string }, FormData>({
      query: (data) => ({
        url: `/users/profile`,
        method: "POST",
        //fetchBaseQuery which uses Fetch API underneath will add the correct content-type header from body
        body: data,
      }),
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
      invalidatesTags: (result, error, arg) => [
        { type: "User", id: "PROFILE" },
      ],
    }),

    //update user
    updateUser: builder.mutation<
      { message: string },
      Partial<IUser & { newPassword: string }>
    >({
      query: (data) => ({
        url: `/users`,
        method: "PATCH",
        //fetchBaseQuery which uses Fetch API underneath will add the correct content-type header from body
        body: data,
      }),
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
      invalidatesTags: (result, error, arg) => [{ type: "User", id: "USER" }],
    }),

    //update profile
    updateProfile: builder.mutation<{ message: string }, FormData>({
      query: (data) => ({
        url: `/users/profile`,
        method: "PATCH",
        //fetchBaseQuery which uses Fetch API underneath will add the correct content-type header from body
        body: data,
      }),
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
      invalidatesTags: (result, error, arg) => [
        { type: "User", id: "PROFILE" },
      ],
    }),

    //delete User//close account/not used
    deleteUser: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: `/users`,
        method: "DELETE",
      }),
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
      invalidatesTags: (result, error, id) => [{ type: "User", id: "USER" }],
    }),
  }),
  //   overrideExisting: false,
});

export const {
  useGetUserQuery,
  useRegisterUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useCreateProfileMutation,
} = userApiSlice;
