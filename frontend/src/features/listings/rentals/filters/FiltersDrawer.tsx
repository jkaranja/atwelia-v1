import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Drawer,
  FormControlLabel,
  IconButton,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import Bathrooms from "../../../../components/Bathrooms";
import Bedrooms from "../../../../components/Bedrooms";
import LocationPicker from "../../../../components/LocationPicker";
import PriceRange from "../../../../components/PriceRange";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { ILocation } from "../../../../types/listing";
import {
  TAmenitiesInputs,
  TFactInputs,
} from "../../../../types/react-hook-form";
import { AMENITIES } from "../../mylistings/post/FactsForm";
import {
  addToFilters,
  resetFilters,
  selectSearchFilters,
} from "../rentalSlice";

const drawerWidth = 600;

type FiltersDrawerProps = {
  open: boolean;
  handleDrawerToggle: () => void;
  total: number;
};

const FiltersDrawer = ({
  open,
  handleDrawerToggle,
  total,
}: FiltersDrawerProps) => {
  const filters = useAppSelector(selectSearchFilters);

  const dispatch = useAppDispatch();

  const [location, setLocation] = useState(
    filters.location || ({} as ILocation)
  );

  const [priceRange, setPriceRange] = useState(
    filters.priceRange || [100, 500000]
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
    watch,
    register,
    reset: resetForm,
    getValues,
    setValue,
  } = useForm<TFactInputs>({
    defaultValues: {
      bedrooms: filters.bedrooms || "",
      bathrooms: filters.bathrooms || "",
      amenities: {
        water: filters.amenities?.water || false,
        borehole: filters.amenities?.borehole || false,
        parking: filters.amenities?.parking || false,
        wifi: filters.amenities?.wifi || false,
        gym: filters.amenities?.gym || false,
        pool: filters.amenities?.pool || false,
        cctv: filters.amenities?.cctv || false,
        securityLights: filters.amenities?.securityLights || false,
        watchman: filters.amenities?.watchman || false,
      },
    },
  });

  const formValues = useWatch({ control }); //all fields//use name: "field"| ["field1"]

  const handleReset = () => {
    dispatch(resetFilters());
    handleDrawerToggle();
  };

  // //update filters in store
  useEffect(() => {
    const entries = formValues as TFactInputs;
    dispatch(
      addToFilters({
        location,
        priceRange,
        ...entries, //form values
      })
    );
  }, [formValues, location, priceRange]);

  return (
    <Box>
      <Drawer
        hideBackdrop={true} //false//If true the backdrop is not rendered//onclose won't work clicking outside of drawer= backdrop.
        // transitionDuration={3000} //number | {enter: number, exit: number} //The duration for the transition, in milliseconds.
        anchor="right" //| left | "right"| "bottom" | "top"
        //variant //'temporary'//'permanent' | 'persistent'->Persistent/Permanent= sits on the same surface elevation as the content.
        //variant = Permanent-> can't be closed & always visible
        open={open}
        onClose={handleDrawerToggle} //close on click outside of drawer/backdrop(when it is not hidden)
        sx={{
          // display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: { xs: 350, sm: 450, md: drawerWidth },
          },

          position: "relative",
        }}
      >
        <Box
          display="flex"
          px={2}
          py={1}
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="subtitle1">Filters</Typography>
          <IconButton color="inherit" onClick={handleDrawerToggle}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />

        <Box
          display="flex"
          flexDirection="column"
          rowGap={3}
          maxHeight="88vh"
          overflow="auto"
          p={3}
        >
          <Typography variant="h6">Location</Typography>
          <LocationPicker setLocation={setLocation} location={location} />

          <Typography variant="h6">Price Range</Typography>
          <PriceRange priceRange={priceRange} setPriceRange={setPriceRange} />

          <Typography variant="h6">Bedrooms</Typography>
          <Bedrooms defaultBedrooms={filters.bedrooms!} setValue={setValue} />

          <Typography variant="h6">Bathrooms</Typography>
          <Bathrooms
            defaultBathrooms={filters.bedrooms!}
            setValue={setValue}
          />

          <Typography variant="h6">Amenities</Typography>

          {AMENITIES.map((item, i) => {
            const key = item.key as keyof TAmenitiesInputs;
            return (
              <FormControlLabel
                key={key + i}
                control={
                  <Controller
                    name={`amenities.${key}`}
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        onChange={(e) => field.onChange(e.target.checked)}
                        checked={field.value}
                      />
                    )}
                  />
                }
                label={item.value}
              />
            );
          })}
        </Box>

        <Box
          position="absolute"
          bottom={0}
          display="flex"
          justifyContent="space-between"
          width="100%"
          px={3}
          pb={3}
          pt={1}
          bgcolor="#fff"
          borderTop={1}
          borderColor="gray.border"
        >
          <Button color="error" variant="outlined" onClick={handleReset}>
            Reset filters
          </Button>
          <Button
            color="secondary"
            variant="contained"
            onClick={handleDrawerToggle}
          >
            Show {total} results
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
};

export default FiltersDrawer;
