import { useEffect, useState } from "react";

import { Box, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useForm, useWatch } from "react-hook-form";
import Amenities from "../../../../components/Amenities";
import Bathrooms from "../../../../components/Bathrooms";
import Bedrooms from "../../../../components/Bedrooms";
import ListingPrice from "../../../../components/ListingPrice";
import LocationPicker from "../../../../components/LocationPicker";
import Overview from "../../../../components/Overview";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { ILocation } from "../../../../types/listing";
import {
  TFactInputs
} from "../../../../types/react-hook-form";
import { addToDraft, selectDraftListing } from "../listingSlice";

export const AMENITIES = [
  { key: "water", value: "Water 7 days/week" },
  { key: "borehole", value: "Borehole" },
  { key: "parking", value: "Spacious parking" },
  { key: "wifi", value: "Wifi" },
  { key: "gym", value: "Gym" },
  { key: "pool", value: "Swimming pool" },
  { key: "cctv", value: "CCTV" },
  { key: "securityLights", value: "Security lights" },
  { key: "watchman", value: "Watchman/security guard" },
];

const FactsForm = () => {
  const draft = useAppSelector(selectDraftListing);
  const dispatch = useAppDispatch();

  const [location, setLocation] = useState(draft.location || ({} as ILocation));

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
    watch,
    register,
    reset: resetForm,
    getValues, //returns
    setValue,
  } = useForm<TFactInputs>({
    defaultValues: {
      bedrooms: draft.bedrooms || "",
      bathrooms: draft.bathrooms || "",
      price: draft.price || "",      
      overview: draft.overview || "",
      amenities: {
        water: draft.amenities?.water || false,
        borehole: draft.amenities?.borehole || false,
        parking: draft.amenities?.parking || false,
        wifi: draft.amenities?.wifi || false,
        gym: draft.amenities?.gym || false,
        pool: draft.amenities?.pool || false,
        cctv: draft.amenities?.cctv || false,
        securityLights: draft.amenities?.securityLights || false,
        watchman: draft.amenities?.watchman || false,
      },
    },
  });

  const formValues = useWatch({ control }); //all fields//use name: "field"| ["field1"]

  // //update draft in store
  useEffect(() => {
    const entries = formValues as TFactInputs;
    dispatch(
      addToDraft({
        location,
        ...entries, //form values
      })
    );

    // Callback version of watch. Optimized for performance. Render at hook level instead of whole app  It's your responsibility to unsubscribe when done.
    ////NOTE: when this runs on mount, data is undefined if defaultValues are not provided. It will only have values if inputs changed
    //For some reason, the callback is not being called on mount. Only when input changes
    // const subscription:ReturnType<typeof watch>/type not needed = watch((data) => {
    //   //console.log(data, name, type); 2nd param: { name, type }//name=name of field that changed, type= event type eg 'change'
    //   const values = data as TFactInputs;
    //   //ERROR: can't dispatch if using deep nesting i.e field is an object eg 'amenities.parking':
    //   //error:TypeError: Cannot assign to read only property 'parking' of object
    //  //sol: use useWatch() or when form don't have fields whose value is an object
    //   dispatch(
    //     addToDraft({
    //       location,
    //       ...values, //form values as an object
    //       //below handled in input field in register field
    //       // price: price.replace(/[^0-9]/g, "") || "0", //only numbers, default is 0,
    //       // brokerFee: brokerFee.replace(/[^0-9]/g, "") || "0", //only numbers, default is 0
    //     })
    //   );
    // });
    // return () => subscription.unsubscribe();//pass watch in dependencies array
  }, [formValues, location]);

  return (
    <Box>
      <Grid2
        container
        justifyContent="space-between"
        rowSpacing={2}
        columnGap={4}
        flexDirection={{ xs: "column", md: "row" }}
      >
        <Grid2 xs container flexDirection="column" rowGap={3}>
          <Typography variant="h6">
            Location
            <Typography pl={0.5} color="muted.main" component="span">
              *
            </Typography>
          </Typography>
          <LocationPicker
            setLocation={setLocation}
            location={location}
            helperText="Start typing and pick the nearest suggested place"
          />

          <Typography variant="h6">
            Bedrooms
            <Typography pl={0.5} color="muted.main" component="span">
              *
            </Typography>
          </Typography>
          <Bedrooms defaultBedrooms={draft.bedrooms!} setValue={setValue} />

          <Typography variant="h6">
            Bathrooms
            <Typography pl={0.5} color="muted.main" component="span">
              *
            </Typography>
          </Typography>
          <Bathrooms defaultBathrooms={draft.bathrooms!} setValue={setValue} />

          <Typography variant="h6">
            Rent (per month)
            <Typography pl={0.5} color="muted.main" component="span">
              *
            </Typography>
          </Typography>
          <ListingPrice register={register} />
        </Grid2>

        <Grid2 xs container flexDirection="column" rowGap={3}>
          <Typography variant="h6">Amenities</Typography>
          <Amenities control={control} />

          <Box>
            <Typography variant="h6">Overview</Typography>
            <Typography variant="body2" color="muted.main">
              A brief overview or additional info about the listing.
            </Typography>
            <Overview register={register} />
          </Box>
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default FactsForm;
