import { apiSlice } from "../../app/api/apiSlice";
import { logOut, setCredentials } from "./authSlice";

const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //login user
    login: builder.mutation<
      { accessToken: string; },
      { phoneNumber: string; password: string }
    >({
      query: (loginInfo) => ({
        url: `/auth/login`,
        method: "POST",
        body: loginInfo,
      }),
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
    }),

    //forgot pwd request
    forgotPwd: builder.mutation<
      { message: string },
      { phoneNumber: string; email: string }
    >({
      query: (data) => ({
        url: `/auth/forgot`,
        method: "PATCH",
        body: data,
      }),
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
    }),
    //reset password
    resetPwd: builder.mutation<
      { message: string },
      { resetPwdToken: string; password: string }
    >({
      query: ({ resetPwdToken, password }) => ({
        url: `/auth/reset/${resetPwdToken}`,
        method: "PATCH",
        body: { password },
      }),
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
    }),

    //logout
    sendLogout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          //console.log(data);
          dispatch(logOut());
          //when store is being removed from memory, reset to clean any rogue timers//avoid memory leaks
          setTimeout(() => {
            dispatch(apiSlice.util.resetApiState());
          }, 1000);
        } catch (err) {
          //console.log(err);
        }
      },
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
    }),
    //refresh token//persist on page reload or remember me//useLazyQuery() not working->says not a function
    //so use mutation with GET instead of query so we can have a trigger function
    refresh: builder.mutation<{ accessToken: string }, void>({
      query: () => ({
        url: "/auth/refresh",
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // console.log(data);
          const { accessToken } = data;
          dispatch(setCredentials(accessToken));
        } catch (err) {
          // console.log(err);
        }
      },
      transformErrorResponse: (response, meta, arg) =>
        (response.data as { message: string })?.message,
    }),
  }),
  //   overrideExisting: false,
});

export const {
  useSendLogoutMutation,
  useRefreshMutation,
  useLoginMutation,
  useForgotPwdMutation,
  useResetPwdMutation,
} = authApiSlice;
