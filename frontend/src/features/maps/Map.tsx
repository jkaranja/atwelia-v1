import React, { useEffect, useRef, useState } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { MarkerF } from "@react-google-maps/api";

import { Box, Skeleton, TextField, Typography } from "@mui/material";
import { IListing, ILocation } from "../../types/listing";
import { useAppSelector } from "../../hooks/useAppSelector";
import { selectSearchFilters } from "../listings/rentals/rentalSlice";
import ViewLive from "../listings/view/ViewLive";
import { useSearchParams } from "react-router-dom";

const containerStyle = {
  width: "100%",
  height: "88.9vh", //must provide height//don't use 'auto'
};

const center = {
  lat: 34.0549,
  lng: -118.2426,
};

type MapProps = {
  data: IListing[];
};

const Map = ({ data }: MapProps) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_MAPS_API_KEY,
    libraries: ["places"], //enable places api/for auto completion to work i.e when map script is loaded include places lib since the auto complete package won't try to load the script again else places lib will be missing
    language: "en-US",
  });

  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useAppSelector(selectSearchFilters);

  const [openViewD, setOpenViewD] = useState(false);
  const handleToggleViewD = () => setOpenViewD((prev) => !prev);
  const [listing, setListing] = useState("");

  //pass this inside useState()
  ///**@type google.maps.Map*/ (null)

  const [map, setMap] = React.useState<google.maps.Map | null>(null);

  //zoom to position on map
  const panTo = () => {
    //map.panTo(center);
  };

  //on load, get the map instance
  const onLoad = React.useCallback((map: google.maps.Map) => {
    //map is the the map itself. use it to eg panTo etc
    // This is just an example of getting and using the map instance!!!
    // const bounds = new window.google.maps.LatLngBounds(center);
    // map.fitBounds(bounds);//not good//zooming too much
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(() => {
    setMap(null);
  }, []);

  const handleMarkerClick = (id: string) => {
    setListing(id);
  };

  //use this approach//adding view listing component when adding markers is making title display only one location
  //it is also display one location on click
  //so, Map component should only have allowed child components such as Marker, DirectionsRenderer
  useEffect(() => {
    if (listing && !openViewD) {
      handleToggleViewD();
      setSearchParams({ id: listing });
    }
  }, [listing]);

  useEffect(() => {
    //can choose not to use map.panTo + filter marker but instead make 'center' dynamic
    //zoom to this position//but you must add a marker with this position too.
    map?.panTo({
      lat: filters.location?.coordinate?.latitude || center.lat,
      lng: filters.location?.coordinate?.longitude || center.lng,
    });
  }, [filters.location]);

  if (!isLoaded) return <Skeleton />;

  return (
    <Box>
      {openViewD && (
        <ViewLive
          open={openViewD}
          handleClose={handleToggleViewD}
          id={listing}
        />
      )}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center} //center is cbd//map pans to this location on load
        //zoom={15}
        zoom={7}//required
        onLoad={onLoad}
        onUnmount={onUnmount}
        // options={{
        //  // zoomControl: false,
        //   //streetViewControl: false,
        //   //mapTypeControl: false,
        //   //fullscreenControl: false,
        // }}
      >
        {/* Child components, such as markers, info windows, etc. */}

        {
          /*
        <MarkerF
          // title={filters.location?.description || "Nairobi Central"}//not updating onChange
          position={{
            lat: filters.location?.coordinate?.latitude || center.lat,
            lng: filters.location?.coordinate?.longitude || center.lng,
          }} //Marker position
          // label="CBD" //Adds a label to the marker. The label can either be a string, or a MarkerLabel object.
          onClick={(e: google.maps.MapMouseEvent) => {
            //console.log(e.latLng) //The latitude/longitude that was below the cursor when the event occurred.
          }} //This event is fired when the marker icon was clicked
          //visible // /** If true, the marker is visible */
          //title="ggg" ///** Rollover text */
          //opacity={0.9} //The marker's opacity between 0.0 and 1.0.
          // icon="hello" //icon or string//Icon for the foreground. If a string is provided, it is treated as though it were an Icon with the string as url.
          //clickable //If true, the marker receives mouse and touch events. Default value is true.
          //cursor="" //Mouse cursor to show on hover
          // zIndex={1}
          //onDblClick//gets event.latLn//event is fired when the marker icon was double clicked.
          //draggable//If true, the marker can be dragged. Default value is false.
          //onDrag //gets event.latLn//
          //onDragEnd//gets event.latLn//
          //onMouseOver//gets event.latLn//This event is fired when the mouse enters the area of the marker icon.
          //onLoad//(marker: google.maps.Marker)=>void//called when the marker instance has loaded.
          // />*/
        }

        {data.map((data, i) => {
          return (
            <MarkerF
              title={data.location?.description || ""}
              onClick={() => handleMarkerClick(data._id)}
              key={i}
              position={{
                lat: data.location?.coordinate?.latitude || center.lat,
                lng: data.location?.coordinate?.longitude || center.lng,
              }}
            />
          );
        })}

        {/* {directionsResponse && (
          <DirectionsRenderer directions={directionsResponse} />
        )} */}
      </GoogleMap>
    </Box>
  );
};

export default React.memo(Map);
