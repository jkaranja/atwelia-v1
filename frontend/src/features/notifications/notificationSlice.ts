//In some cases, TypeScript may unnecessarily tighten the type of the initial state. If that happens, you can work around it by casting the initial state using as, instead of declaring the type of the variable:
// Workaround: cast state instead of declaring variable type
// const initialState = {
//   value: 0,
// } as CounterState

import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { INotificationResult } from "./notificationsApiSlice";
import { RootState } from "../../app/store";

interface NotificationState {
  notifications: null | INotificationResult;
}

const initialState: NotificationState = {
  notifications: null,
  //pushToken: null,
};

//slice
const notificationSlice = createSlice({
  name: "notifications",
  initialState,

  reducers: {
    setNotifications: (state, action: PayloadAction<INotificationResult>) => {
      state.notifications = action.payload;
    },
    resetNotifications: (state) => {
      state.notifications = null;
    },
  },
});

export const { setNotifications, resetNotifications } =
  notificationSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectNotifications = (state: RootState) =>
  state.notifications.notifications;

export default notificationSlice.reducer;
