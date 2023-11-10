import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { Role } from "../../types/user";

// Define a type for the slice state
interface AuthState {
  token: null | string;
  role: Role;
}

//In some cases, TypeScript may unnecessarily tighten the type of the initial state. If that happens, you can work around it by casting the initial state using as, instead of declaring the type of the variable:
// Workaround: cast state instead of declaring variable type
// const initialState = {
//   value: 0,
// } as CounterState

const initialState: AuthState = {
  token: null,
  role: localStorage.getItem("role") === Role.Agent ? Role.Agent : Role.Renter,
};

//slice
const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    logOut: (state) => {
      state.token = null;
    },
    setCredentials: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setRole: (state, action: PayloadAction<Role>) => {
      state.role = action.payload;
      localStorage.setItem("role", action.payload);
    },
  },
});

export const { logOut, setCredentials, setRole } = authSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCurrentToken = (state: RootState) => state.auth.token;

export const selectCurrentRole = (state: RootState) => state.auth.role;

export default authSlice.reducer;
