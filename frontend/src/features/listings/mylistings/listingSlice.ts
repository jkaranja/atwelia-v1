import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { IListing } from "../../../types/listing";
import { IImage } from "../../../types/file";
import { RootState } from "../../../app/store";

//In some cases, TypeScript may unnecessarily tighten the type of the initial state. If that happens, you can work around it by casting the initial state using as, instead of declaring the type of the variable:
// Workaround: cast state instead of declaring variable type
// const initialState = {
//   value: 0,
// } as CounterState

interface ListingsState {
  draftListing: Partial<IListing>;
  updatedListing: Partial<IListing>;
}

const initialState: ListingsState = {
  draftListing: {},
  updatedListing: {},
};

//slice
const listingSlice = createSlice({
  name: "listings",
  initialState,

  reducers: {
    addToDraft: (state, action: PayloadAction<Partial<IListing>>) => {
      state.draftListing = { ...state.draftListing, ...action.payload };
    },
    resetDraft: (state) => {
      state.draftListing = {};
    },

    addToUpdated: (state, action: PayloadAction<Partial<IListing>>) => {
      state.updatedListing = { ...state.updatedListing, ...action.payload };
    },
    resetUpdated: (state) => {
      state.updatedListing = {};
    },
  },
});

export const { addToDraft, resetDraft, addToUpdated, resetUpdated } =
  listingSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectDraftListing = (state: RootState) =>
  state.listings.draftListing;

export const selectUpdatedListing = (state: RootState) =>
  state.listings.updatedListing;

export default listingSlice.reducer;
