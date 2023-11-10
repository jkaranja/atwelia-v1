import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useEffect, useState } from "react";

import { Box, Typography } from "@mui/material";
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
import { addToUpdated, selectUpdatedListing } from "../listingSlice";

const FactsForm = () => {
  const updated = useAppSelector(selectUpdatedListing);
  const dispatch = useAppDispatch();

  const [location, setLocation] = useState(
    updated.location || ({} as ILocation)
  );

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
      bedrooms: updated.bedrooms || "",
      bathrooms: updated.bathrooms || "",
      price: updated.price || 0,      
      overview: updated.overview || "",
      amenities: {
        water: updated.amenities?.water || false,
        borehole: updated.amenities?.borehole || false,
        parking: updated.amenities?.parking || false,
        wifi: updated.amenities?.wifi || false,
        gym: updated.amenities?.gym || false,
        pool: updated.amenities?.pool || false,
        cctv: updated.amenities?.cctv || false,
        securityLights: updated.amenities?.securityLights || false,
        watchman: updated.amenities?.watchman || false,
      },
    },
  });
  const formValues = useWatch({ control }); //all fields//use name: "field"| ["field1"]

  // //update updated in store
  useEffect(() => {
    const entries = formValues as TFactInputs;
    dispatch(
      addToUpdated({
        location,
        ...entries, //form values
      })
    );
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
          <LocationPicker setLocation={setLocation} location={location} />

          <Typography variant="h6">
            Bedrooms
            <Typography pl={0.5} color="muted.main" component="span">
              *
            </Typography>
          </Typography>
          <Bedrooms defaultBedrooms={updated.bedrooms!} setValue={setValue} />

          <Typography variant="h6">
            Bathrooms
            <Typography pl={0.5} color="muted.main" component="span">
              *
            </Typography>
          </Typography>
          <Bathrooms
            defaultBathrooms={updated.bathrooms!}
            setValue={setValue}
          />

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
