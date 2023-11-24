import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { Box, IconButton, InputAdornment, TextField } from "@mui/material";
import { usePlacesWidget } from "react-google-autocomplete";
import { ILocation } from "../types/listing";
//import Autocomplete from "react-google-autocomplete";

type LocationPickerProps = {
  setLocation: React.Dispatch<React.SetStateAction<ILocation>>;
  location: ILocation;
} & Record<string, any>;

const LocationPicker = ({
  setLocation,
  location,
  ...props
}: LocationPickerProps) => {
  //Instead of the Autocomplete component, can use this hook and pass the ref to any input element.
  //pass the ref to your custom input and config options inside this hook
  const { ref } = usePlacesWidget({
    //these props are same props that can be passed to Autocomplete component.
    apiKey: import.meta.env.VITE_MAPS_API_KEY,
    //Below function gets invoked every time a user chooses location.
    onPlaceSelected: (place) => {
      //place is an object:
      //{
      // "address_components":[{"long_name":"Githunguri","short_name":"Githunguri","types":["locality","political"]}, {"long_name":"Kiambu County","short_name":"Kiambu County","types":["administrative_area_level_1","political"]},{"long_name":"Kenya","short_name":"KE","types":["country","political"]}],
      // "formatted_address":"Githunguri, Kenya",
      // "geometry":{"location":{"lat":-1.0586336,"lng":36.7779108}},//lat and lng = ()=> number
      // "place_id":"ChIJB8JArykuLxgR2YkW40Ly_Ng","html_attributions":[]
      // }

      if (!place?.geometry?.location) return;

      setLocation({
        coordinate: {
          latitude: place.geometry.location.lat(),
          longitude: place.geometry.location.lng(),
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        },
        description: place.formatted_address!,
      });
    },
    options: {
      types: ["geocode"], //By default it uses '(cities)'.//can't mix both '(regions)' and '(cities)'//
      //(regions) collection matches: locality, sublocality,postal_code,country,administrative_area_level_1/2
      //(cities) collection instructs the Places service to return results that match locality or administrative_area_level_3
      //types: ['school','drugstore','neighborhood', 'locality', 'sublocality'],
      //types: ['establishment'],
      //types: ['geocode'] //this should work !//returns all areas//geocode instructs the Place Autocomplete service to return only geocoding results, rather than business results. use when the location specified may be indeterminate.
      //NOTE: You can safely mix the geocode and establishment types. You cannot mix type collections (address, (cities) or (regions)) with any other type, or an error occurs.
      //More: https://developers.google.com/maps/documentation/places/web-service/supported_types#table3
     // componentRestrictions: { country: "ke" },
    },
    //fields: //By default it uses address_components, geometry.location, place_id, formatted_address.
    //inputAutocompleteValue: Autocomplete value to be set to the underlying input.
  });

  return (
    <Box>
      {/* <Autocomplete
        apiKey={import.meta.env.VITE_MAPS_API_KEY}
        //Below function gets invoked every time a user chooses location.
        //style={{ width: "90%" }}
        onPlaceSelected={(place) => {
          console.log(place);
        }}
        options={{
          types: ["(regions)"],
          componentRestrictions: { country: "ru" },
        }}
        //inputAutocompleteValue: Autocomplete value to be set to the underlying input.
        //defaultValue prop is used for setting up the default value e.g defaultValue={'Amsterdam'}.
       //it will accept any other props for the input element eg type, name etc, style, id, className
       //language: Set language to be used for the results. If not specified, Google defaults to load the most appropriate language based on the users location or browser setting.
      /> */}

      {/*CHANGE THE Z-INDEX(using this class in css .pac-container{z-index: }) FOR IT TO SHOW THE SUGGESTION BOX WHEN USING THIS IN A MODAL/DRAWER ETC ELSE IT WILL NOT BE VISIBLE:
      IF USING MUI, SEE https://mui.com/material-ui/customization/z-index/ */}
      <TextField
        // sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, display: "block" }}
        inputRef={ref}
        type="search"
        fullWidth
        placeholder="Search location"
        defaultValue={location?.description || ""}
        // size="small"
        //variant="standard"        
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <IconButton color="primary" size="small">
                <LocationOnOutlinedIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        {...props}
      />
    </Box>
  );
};

export default LocationPicker;
