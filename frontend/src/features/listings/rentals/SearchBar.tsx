import EventNoteIcon from "@mui/icons-material/EventNote";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  AppBar,
  Button,
  ButtonGroup,
  Toolbar,
  Typography,
} from "@mui/material";
import Box from "@mui/system/Box";
import React, { useEffect, useState } from "react";
import TuneIcon from "@mui/icons-material/Tune";
import Menu from "@mui/material/Menu";

import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

import { useAppSelector } from "../../../hooks/useAppSelector";
import { ILocation } from "../../../types/listing";
import FiltersDrawer from "./filters/FiltersDrawer";
import { addToFilters, selectSearchFilters } from "./rentalSlice";

import LocationPicker from "../../../components/LocationPicker";
import PriceRange from "../../../components/PriceRange";
import { useAppDispatch } from "../../../hooks/useAppDispatch";

const BEDROOMS = [
  "",
  "Single",
  "Bedsitter",
  "1 Bedroom",
  "2 Bedrooms",
  "3 Bedrooms",
  "4+ Bedrooms",
];

type SearchBarProps = {
  total: number;
};

const SearchBar = ({ total }: SearchBarProps) => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(selectSearchFilters);

  const [location, setLocation] = useState(
    filters.location || ({} as ILocation)
  );

  const [bedrooms, setBedrooms] = useState<string>(filters.bedrooms || "");

  const [priceRange, setPriceRange] = useState([100, 500000]);
  //filter drawer
  const [visible, setVisible] = React.useState(false);

  //menu
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setVisible((prev) => !prev);
  };

  //update filters in store
  useEffect(() => {
    dispatch(
      addToFilters({
        bedrooms,
        location,
        priceRange,
      })
    );
  }, [bedrooms, location, dispatch, priceRange]);

  //drawer props
  const drawerProps = {
    open: visible,
    handleDrawerToggle,
  };

  return (
    <Box>
      {visible && <FiltersDrawer total={total} {...drawerProps} />}
      <AppBar
        component="nav"
        elevation={0}
        position="fixed"
        // color="transparent"
        sx={{
          top: 65,
          bgcolor: "#fff",
          // borderColor: "gray.border",
          // borderStyle: "solid",
          //borderWidth: "0 0 1px",
        }}
      >
        <Toolbar variant="dense" sx={{ pb: 0.8, pt: 1 }}>
          <Grid2
            container
            justifyContent="space-between"
            columnSpacing={2}
            rowSpacing={2}
            //flexDirection={{ xs: "column", sm: "row" }}
            alignItems="center"
            width="100%"
          >
            <Grid2 xs="auto" flexGrow={2}>
              <LocationPicker
                location={location}
                setLocation={setLocation}
                size="small"
              />
            </Grid2>
            <Grid2
              xs="auto"
              display={{ xs: "none", lg: "flex" }}
              flexGrow={3}
              justifyContent="center"
            >
              <ButtonGroup
                variant="outlined"
                aria-label="outlined button group"
                // size="large"
              >
                {BEDROOMS.map((bedroom, i) => {
                  return (
                    <Button
                      // variant="contained"
                      key={i}
                      onClick={() => setBedrooms(bedroom)}
                      //color={bedroom === bedrooms ? "primary" : "inherit"}
                      sx={{
                        color:
                          bedroom === filters?.bedrooms
                            ? "primary"
                            : "muted.main",
                        borderColor: "gray.border",
                        textTransform: "none",
                        px: 1,
                      }}
                    >
                      {bedroom === "" ? "Any" : bedroom}
                    </Button>
                  );
                })}
              </ButtonGroup>
            </Grid2>

            <Grid2
              xs="auto"
              container
              columnGap={3}
              justifyContent="flex-end"
              flexGrow={2}
            >
              <Button
                //display={{ xs: "none", lg: "flex" }}
                type="submit"
                // size="large"
                variant="outlined"
                //fullWidth
                //color="inherit"
                endIcon={<ExpandMoreIcon />}
                sx={{
                  color: "muted.main",
                  borderColor: "gray.border",
                  textTransform: "none",
                  display: { xs: "none", sm: "flex" },
                }}
                onClick={handleClick}
              >
                Price range
              </Button>

              {open && (
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                  <Box width={450} p={3} py={4}>
                    <Typography variant="h6" paragraph>
                      Price Range
                    </Typography>
                    <PriceRange
                      priceRange={priceRange}
                      setPriceRange={setPriceRange}
                    />
                    <Box pt={3}>
                      {/* <Button fullWidth variant="contained" onClick={handleClose}>
                      Apply
                    </Button> */}
                    </Box>
                  </Box>
                </Menu>
              )}

              <Button
                startIcon={<TuneIcon />}
                //color="inherit"
                variant="outlined"
                onClick={handleDrawerToggle}
                //size="large"
                //fullWidth
                sx={{
                  color: "muted.main",
                  borderColor: "gray.border",
                  textTransform: "none",
                }}
              >
                Filters
              </Button>
            </Grid2>
          </Grid2>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default SearchBar;
