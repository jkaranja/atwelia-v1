import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

//What are the deltas
// Latitude and longitude are self explanatory while latitudeDelta and longitudeDelta may not. On the developer.apple.com website this is how the "latitudeDelta" property is explained:
// The amount of north-to-south distance (measured in degrees) to display on the map. Unlike longitudinal distances, which vary based on the latitude, one degree of latitude is always approximately 111 kilometers (69 miles).

// Define a type for the slice state
interface Coordinate {
  //angles measured from center of the sphere(horizontally for longitudes and vertically for latitudes)
  latitude: number; //(distance from equator -90south pole<=0=>90 north pole)angle that ranges from –90° at the south pole to 90° at the north pole, with 0° at the Equator(covers 180 degrees).
  longitude: number; //(distance from prime meridian -180west<=0=>180east) in degrees from 0° at the Prime Meridian to +180° eastward and −180° westward(covers 360 degrees)
  latitudeDelta: number; //height/used for zooming in on the map
  longitudeDelta: number; ///width/used for zooming in on the map
}

interface DistanceMatrix {
  distance: { text: string; value: number }; //text:miles, value unit: meters
  duration: { text: string; value: number }; ////text:time period, value unit: secs
}
interface Origin {
  location: Coordinate;
  description?: string;
}

interface Destination {
  location: Coordinate;
  description?: string;
}

interface NavState {
  origin: Origin | null;
  destination: Destination | null;
  travelTimeInfo: null | DistanceMatrix;
}

//In some cases, TypeScript may unnecessarily tighten the type of the initial state. If that happens, you can work around it by casting the initial state using as, instead of declaring the type of the variable:
// Workaround: cast state instead of declaring variable type
// const initialState = {
//   value: 0,
// } as CounterState

const initialState: NavState = {
  origin: null,
  destination: null,
  travelTimeInfo: null,
};

//slice
const navSlice = createSlice({
  name: "nav",
  initialState,

  reducers: {
    setOrigin: (state, action: PayloadAction<Origin>) => {
      state.origin = action.payload;
    },
    setDestination: (state, action: PayloadAction<Destination>) => {
      state.destination = action.payload;
    },
    setTravelTimeInfo: (state, action: PayloadAction<DistanceMatrix>) => {
      state.travelTimeInfo = action.payload;
    },
  },
});

export const { setOrigin, setDestination, setTravelTimeInfo } =
  navSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectOrigin = (state: RootState) => state.nav.origin;
export const selectDestination = (state: RootState) => state.nav.destination;
export const selectTravelTimeInfo = (state: RootState) =>
  state.nav.travelTimeInfo;

export default navSlice.reducer;
