import React, { useRef, useState } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";

import { Box, Skeleton, TextField, Typography } from "@mui/material";

const containerStyle = {
  width: "100%",
  height: "95vh", //must provide height//don't use 'auto'
};

const center = {
  lat: -3.745,
  lng: -38.523,
};

const Map = () => {
  const { isLoaded, loadError,  } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_MAPS_API_KEY,
    libraries: ["places"], //if both maps and the auto complete are used in same page, you must enable places api here for auto completion package(the auto complete won't work as it will skip loading places library(altho not loaded) when it notices maps script is already loaded)
    //The Map component loads the google script first, but does not include the places library unless specified. When you load the autocomplete component after, google sees you already have the map script loaded, so it does not add it again. This is why you must specify all the libraries on the component that loads the google maps script first.
  });

  /** @type React.MutableRefObject<HTMLInputElement> */
  /** @type React.MutableRefObject<HTMLInputElement> */

  const originRef = useRef<HTMLInputElement>(null);

  const destinationRef = useRef<HTMLInputElement>(null);

  const [directionsResponse, setDirectionsResponse] =
    useState<google.maps.DirectionsResult | null>(null);

  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");

  //pass this inside useState()
  ///**@type google.maps.Map*/ (null)

  const [map, setMap] = React.useState<google.maps.Map | null>(null);

  //zoom to marker
  const panTo = () => {
    //map.panTo(center);
  };

  const onLoad = React.useCallback((map: google.maps.Map) => {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    // const bounds = new window.google.maps.LatLngBounds(center);
    // map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(() => {
    setMap(null);
  }, []);

  async function calculateRoute() {
    if (!originRef.current?.value || !destinationRef.current?.value) {
      return;
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current!.value,
      destination: destinationRef.current!.value,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });
    setDirectionsResponse(results);

    setDistance(results.routes[0]?.legs[0]?.distance?.text || ""); //mi//or km if europe //.value//in meters

    setDuration(results.routes[0]?.legs[0]?.duration?.text || ""); //min//.value in secs
  }

  function clearRoute() {
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    originRef.current!.value = "";
    destinationRef.current!.value = "";
  }

  if (!isLoaded) return <Skeleton />;

  return (
    <Box>
      <Box display="flex" justifyContent="space-between">
        <Typography>Distance: {distance} </Typography>
        <Typography>Duration: {duration} </Typography>
      </Box>

      <Box display="flex" justifyContent="space-between">
        <Autocomplete
          onPlaceChanged={() => {
            //setState(destinationRef.current?.value);//a string i.e description only//see locationPicker component
          }}
        >
          <TextField placeholder="Origin" inputRef={originRef} />
        </Autocomplete>

        <Autocomplete onPlaceChanged={() => {}} className="">
          <TextField placeholder="Origin" inputRef={destinationRef} />
        </Autocomplete>
      </Box>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {/* Child components, such as markers, info windows, etc. */}
        <Marker position={center} />
        {directionsResponse && (
          <DirectionsRenderer directions={directionsResponse} />
        )}
      </GoogleMap>
    </Box>
  );
};

export default React.memo(Map);
