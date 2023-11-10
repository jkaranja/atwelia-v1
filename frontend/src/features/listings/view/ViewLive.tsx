import StarIcon from "@mui/icons-material/Star";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import useMediaQuery from "@mui/material/useMediaQuery";

import CallIcon from "@mui/icons-material/Call";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import LaunchIcon from "@mui/icons-material/Launch";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ReportOutlinedIcon from "@mui/icons-material/ReportOutlined";
import {
  Alert,
  Avatar,
  Box,
  ButtonGroup,
  CircularProgress,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Table,
  TableCell,
  TableRow,
  Typography
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import ListingImageList from "../../../components/ListingImageList";
import { PROFILE_PIC_ROOT } from "../../../constants/paths";
import { useGetProfileQuery } from "../../auth/userApiSlice";
import Profile from "./Profile";
import SendMessage from "./SendMessage";
import Slideshow from "./SlideShow";
import { useGetListingQuery } from "./viewApiSlice";

type LiveViewProps = {
  open: boolean;
  handleClose: () => void;
  id: string;
};

const ViewLive = ({ open, handleClose, id }: LiveViewProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));

  const [isPhoneVisible, setIsPhoneVisible] = useState(false);

  const [openMessageD, setOpenMessageD] = useState(false);

  const [openProfileD, setOpenProfileD] = useState(false);

  const handleToggleMessageD = () => setOpenMessageD((prev) => !prev);
  const handleToggleProfileD = () => setOpenProfileD((prev) => !prev);

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

  //handle contact toggle
  const handlePhoneToggle = () => {
    setIsPhoneVisible((prev) => !prev);
  };

  return (
    <Box>
      {openMessageD && (
        <SendMessage
          open={openMessageD}
          handleClose={handleToggleMessageD}
          listing={listing!}
        />
      )}

      {openProfileD && (
        <Profile
          open={openProfileD}
          handleClose={handleToggleProfileD}
          profile={profile!}
        />
      )}

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
                <Box>
                  <Alert variant="outlined" severity="info">
                    Interested in this vacant house? Contact the agent below
                    to take you on a tour to see this and any other rentals
                    they have available for a small fee shown below (paid only
                    after the tour). 
                  </Alert>
                </Box>

                <Box
                  pb={2}
                  px={2}
                  mt={1}
                  mb={2}
                  bgcolor="dull.main"
                  borderRadius={1}
                >
                  <ListItem
                    //dense //If true, compact vertical padding
                    //disableGutters //If true, the left and right padding is removed.
                    disablePadding //If true, all padding is removed.
                    secondaryAction={
                      <Typography>Tour fee: Ksh {profile?.tourFee}</Typography>
                    }
                    sx={{ cursor: "pointer" }}
                    onClick={handleToggleProfileD}
                  >
                    <ListItemAvatar>
                      <Avatar
                        alt={profile?.user?.username}
                        src={`${PROFILE_PIC_ROOT}/${profile?.profilePic?.filename}`}
                      />
                    </ListItemAvatar>

                    <ListItemText
                      primary={
                        <Button
                          sx={{
                            textDecoration: "underline",
                            textTransform: "none",
                            color: "dark.main",
                          }}
                          startIcon={<LaunchIcon />}
                        >
                          {profile?.user?.username}
                        </Button>
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

                  <Box display="flex" justifyContent="space-between">
                    <Button
                      color="inherit"
                      variant="outlined"
                      onClick={handleToggleMessageD}
                    >
                      Send message
                    </Button>
                    <Button
                      color="primary"
                      variant="outlined"
                      onClick={handlePhoneToggle}
                      startIcon={
                        isPhoneVisible ? (
                          <VisibilityOffOutlinedIcon />
                        ) : (
                          <VisibilityOutlinedIcon />
                        )
                      }
                    >
                      {isPhoneVisible ? "Contacts" : "Show contact"}
                    </Button>
                  </Box>

                  {isPhoneVisible && (
                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="flex-end"
                      pt={1}
                    >
                      {profile?.phoneNumbers.map((phone) => (
                        <ListItem sx={{ width: "auto" }} dense>
                          <CallIcon  />
                          <ListItemText primary={phone} />
                        </ListItem>
                      ))}
                    </Box>
                  )}
                </Box>

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

export default ViewLive;
