import { configureStore } from "@reduxjs/toolkit";
// Or from '@reduxjs/toolkit/query/react'
import { setupListeners } from "@reduxjs/toolkit/query";
import { apiSlice } from "./api/apiSlice";

import authReducer from "../features/auth/authSlice";
import notificationReducer from "../features/notifications/notificationSlice";
import listingReducer from "../features/listings/mylistings/listingSlice";
import rentalReducer from "../features/listings/rentals/rentalSlice";
import navReducer from "../features/maps/navSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    nav: navReducer,
    rentals: rentalReducer,
    listings: listingReducer,
    notifications: notificationReducer,
    // Add the generated reducer as a specific top-level slice
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, //To remove serializableCheck
      //This will remove Redux state error in console(when dispatching file array to state): A non-serializable value was detected in the state, in the path:
    }).concat(apiSlice.middleware), //, logger
});

//for typing redux toolkit hooks: useDispatch/useSelector
// Infer the `RootState` and `AppDispatch` types from the store itself
//Inferring these types from the store itself means that they correctly update as you add more state slices or modify middleware settings.

export type RootState = ReturnType<typeof store.getState>; //type for state in useSelector
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState} + thunk middleware types//for useDispatch hook
export type AppDispatch = typeof store.dispatch;

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch);

export default store;
