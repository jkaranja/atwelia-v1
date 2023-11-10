import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { IListing } from "../../../types/listing";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import StarIcon from "@mui/icons-material/Star";
import {
  Avatar,
  Box,
  ButtonGroup,
  CircularProgress,
  IconButton,
  Link,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Table,
  TableCell,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";

import { useState } from "react";
import MyTab from "../../../components/MyTab";
import TabPanel from "../../../components/TabPanel";
import CloseIcon from "@mui/icons-material/Close";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";
import { useGetListingQuery } from "./viewApiSlice";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import CallIcon from "@mui/icons-material/Call";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import ReportOutlinedIcon from "@mui/icons-material/ReportOutlined";
import PaymentAlert from "./PaymentAlert";
import { PROFILE_PIC_ROOT } from "../../../constants/paths";
import ListingImageList from "../../../components/ListingImageList";
import { useGetProfileQuery } from "../../auth/userApiSlice";
import Slideshow from "./SlideShow";

type ViewListingProps = {
  open: boolean;
  handleClose: () => void;
  id: string;
};

const ViewListing = ({ open, handleClose, id }: ViewListingProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

   const theme = useTheme();
   const matches = useMediaQuery(theme.breakpoints.up("md"));


  // type TParams = { id: string };

  // const { id } = useParams<TParams>();

  // const id = parseInt(id!);

  /* ----------------------------------------
   FETCH LISTING
   ----------------------------------------*/

  const {
    data: listing,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetListingQuery(id ?? skipToken, {
    //pollingInterval: 15000,
    //refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  let amenities = {};
  if (listing) {
    //@ts-expect-error //remove _id from amenities
    const { _id, ...cleanAmenities } = listing.amenities;
    amenities = cleanAmenities;
  }

  /* ----------------------------------------
   FETCH profile
   ----------------------------------------*/
  const {
    data: profile,
    // isFetching,
    // isSuccess,
    // isError,
    // error,
  } = useGetProfileQuery(listing?.user?._id ?? skipToken, {
    // pollingInterval: 15000,
    // refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  /* ----------------------------------------
   SCROLL
   ------------------------------------------*/
  const handleScroll = (event: React.MouseEvent<HTMLElement>, id: string) => {
    const anchor = (
      (event.target as HTMLElement).ownerDocument || document
    ).querySelector(`#${id}`);

    if (anchor) {
      anchor.scrollIntoView({
        block: "start",
        behavior: "smooth",
      });
    }
  };

  return (
    <Box>
      <Dialog
        fullWidth //works together with max width
        maxWidth="xl" //default is small
        open={open}
        onClose={handleClose}
      >
        <DialogTitle id="alert-dialog-title" sx={{ p: 0 }}>
          <Box display="flex" justifyContent="flex-end">
            <IconButton size="large" color="default" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ height: "90vh" }}>
          <Box display="flex" justifyContent="center">
            {isFetching && !listing && <CircularProgress color="inherit" />}

            {!isFetching && !listing && (
              <Box textAlign="center">
                <ReportOutlinedIcon fontSize="large" color="error" />
                <Typography color="muted.main">
                  Listing no longer available
                </Typography>
              </Box>
            )}
          </Box>

          {listing && (
            <Grid2
              container
              justifyContent="flex-between"
              spacing={2}
              flexDirection={{ xs: "column", md: "row" }}
            >
              <Grid2 xs maxHeight="85vh" overflow={{ md: "auto" }} flexGrow={2}>
                {matches ? (
                  <ListingImageList images={listing.listingImages ?? []} />
                ) : (
                  <Slideshow images={listing.listingImages ?? []} />
                )}
              </Grid2>
              <Grid2
                xs
                px={3}
                maxHeight="85vh"
                overflow={{ md: "auto" }}
                flexGrow={{ xs: 2, lg: 1 }}
              >
                <Typography gutterBottom variant="h5">
                  {listing.bedrooms}
                </Typography>

                <Typography
                  gutterBottom
                  variant="body2"
                  display="flex"
                  alignItems="center"
                  columnGap={1}
                  px={0}
                >
                  <LocationOnOutlinedIcon sx={{ color: "warning.light" }} />
                  {listing.location?.description}
                </Typography>

                <Typography gutterBottom variant="h6">
                  Ksh {listing.price}/mo
                </Typography>

                <Box py={1} px={2} my={3} bgcolor="dull.main" borderRadius={1}>
                  <ListItem
                    //dense //If true, compact vertical padding
                    //disableGutters //If true, the left and right padding is removed.
                    disablePadding //If true, all padding is removed.
                    // secondaryAction=""
                  >
                    <ListItemAvatar>
                      <Avatar
                        alt={profile?.user?.username}
                        src={`${PROFILE_PIC_ROOT}/${profile?.profilePic?.filename}`}
                      />
                    </ListItemAvatar>

                    <ListItemText
                      primary={
                        <Typography color="dark.main">
                          {profile?.user?.username}
                        </Typography>
                      }
                      secondary={
                        <Box display="flex" alignItems="center" columnGap={0.1}>
                          <StarIcon color="warning" fontSize="small" />
                          <Typography variant="body1">
                            {profile?.rating?.toPrecision(2) || "No rating"}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                </Box>

                <Box py={1}>
                  <ButtonGroup
                    fullWidth
                    aria-label="listing button group"
                    disableElevation
                    color="inherit"
                    size="large"
                    sx={{ color: "muted.main" }}
                  >
                    <Button onClick={(e) => handleScroll(e, "overview-anchor")}>
                      Overview
                    </Button>
                    <Button onClick={(e) => handleScroll(e, "facts-anchor")}>
                      Facts
                    </Button>
                    <Button
                      onClick={(e) => handleScroll(e, "amenities-anchor")}
                    >
                      Amenities
                    </Button>
                 
                  </ButtonGroup>
                </Box>

                <Box>
                  <Box py={3} id="overview-anchor">
                    <Typography variant="h6" paragraph>
                      Overview
                    </Typography>

                    <Typography>{listing.overview}</Typography>
                  </Box>

                  <Box py={3} id="facts-anchor">
                    <Typography variant="h6">Facts</Typography>
                    <Table className="view-listing">
                      <TableRow>
                        <TableCell>Bedrooms</TableCell>
                        <TableCell>{listing.bedrooms}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Rent</TableCell>
                        <TableCell>Ksh {listing.price}</TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell>Bathrooms</TableCell>
                        <TableCell> {listing.bathrooms}</TableCell>
                      </TableRow>
                    </Table>
                  </Box>

                  <Box py={3} id="amenities-anchor">
                    <Typography variant="h6">Amenities</Typography>
                    <Table className="view-listing">
                      {Object.entries(amenities).map(([key, value], i) => {
                        let label = "";
                        if (key === "water") label = "Water 7 days/week";
                        if (key === "borehole") label = "Borehole";
                        if (key === "parking") label = "Spacious parking";
                        if (key === "wifi") label = "Wifi";
                        if (key === "gym") label = "Gym";
                        if (key === "pool") label = "Swimming pool";
                        if (key === "cctv") label = "CCTV";
                        if (key === "securityLights") label = "Security lights";
                        if (key === "watchman")
                          label = "Watchman/security guard";

                        return (
                          <TableRow key={key + i}>
                            <TableCell>{label}</TableCell>
                            <TableCell>
                              {value ? (
                                <CheckIcon color="primary" />
                              ) : (
                                <CloseIcon color="error" />
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </Table>
                  </Box>

                
                </Box>
              </Grid2>
            </Grid2>
          )}
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={handleClose}>Cancel</Button> */}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViewListing;
