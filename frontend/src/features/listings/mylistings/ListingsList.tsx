import EventNoteIcon from "@mui/icons-material/EventNote";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import {
  AppBar,
  Button,
  ButtonGroup,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Toolbar,
  Typography,
  Tabs,
} from "@mui/material";
import Box from "@mui/system/Box";
import SettingsBackupRestoreIcon from "@mui/icons-material/SettingsBackupRestore";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

import { useGetListingsQuery } from "./listingApiSlice";
import Listing from "./Listing";
import useTitle from "../../../hooks/useTitle";
import { IListing } from "../../../types/listing";
import useDebounce from "../../../hooks/useDebounce";
import SkeletonItem from "../../../components/SkeletonItem";
import MUIPagination from "../../../components/MUIPagination";
import PostNew from "./post/PostNew";
import useAuth from "../../../hooks/useAuth";
import { AccountStatus, Role } from "../../../types/user";
import Onboard from "../../onboarding/Onboard";
import ReportOutlinedIcon from "@mui/icons-material/ReportOutlined";
import Intro from "../../../components/Intro";
import MyTab from "../../../components/MyTab";

const STATUS = ["Available", "Unavailable", "Draft"];

const BEDROOMS = [
  "",
  "Single",
  "Bedsitter",
  "1 Bedroom",
  "2 Bedrooms",
  "3 Bedrooms",
  "4+ Bedrooms",
];

const ListingsList = () => {
  useTitle("Listings");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [roles, _id, accountStatus] = useAuth();

  const isAgent = roles.includes(Role.Agent);

  const [bedrooms, setBedrooms] = useState<string>("");

  const [listingStatus, setListingStatus] = useState("Available");
  const [tabValue, setTabValue] = useState<string>("Available");

  //dialogs
  const [openPostNewD, setOpenPostNewD] = useState(false);
  const handleTogglePostNewD = () => setOpenPostNewD((prev) => !prev);
  const [openOnboardD, setOpenOnboardD] = useState(false);
  const handleToggleOnboardD = () => setOpenOnboardD((prev) => !prev);

  const [listingsData, setListingsData] = useState<IListing[]>([]);

  /* ----------------------------------------
   PAGINATION
   ----------------------------------------*/
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(9);

  /* -------------------------------------------------------------
   FETCH LISTINGS
   ----------------------------------------------------------------*/
  const {
    currentData: data, //The latest returned result for the current hook arg, if present.
    //data//The latest returned result regardless of hook arg, if present.
    isFetching,
    isSuccess,
    isError,
    error,
    refetch,
    isLoading,
  } = useGetListingsQuery(
    { itemsPerPage, page, filters: { bedrooms, listingStatus } },
    {
      // pollingInterval: 1000 * 5,//in ms
      // refetchOnFocus: true,
      //last fetched time > 10 secs, refetch//use true |10
      refetchOnMountOrArgChange: true, //in secs
    }
  );

  //store results in states
  useEffect(() => {
    //update the other states
    setListingsData(data?.listings || []);
    setTotalPages(data?.pages || 0);
  }, [data]);

  /* ----------------------------------------
   HANDLE TAB + STATUS CHANGE
   ----------------------------------------*/
  const handleTabChange = (event: React.SyntheticEvent, tabValue: string) => {
    //change listing status
    setListingStatus(tabValue);
    //change tab
    setTabValue(tabValue);
  };

  /* ----------------------------------------
   HANDLE PAGINATION
   ----------------------------------------*/
  //for custom pagination & mui onchange
  const handlePageChange = (page: number) => {
    setPage(page);
  };

  /* ----------------------------------------
   ACTIONS-> CURRENT PAGE - 1
   ----------------------------------------*/
  useEffect(() => {
    //when action is performed eg delete & current page not 1st page and results are zero for current page, move to 1 page back: refetch with page-1
    //This will not fire when moving to a diff tab while page was not 1(see dependency). B4 result for refetch triggered by status change returns, page is already updated below to 1
    if (page !== 1 && isError) {
      handlePageChange(page - 1);
    }
  }, [isError]);

  /* ----------------------------------------
   RESET TO PAGE 1 ->STATUS CHANGE, PAGE!==1
   ----------------------------------------*/
  useEffect(() => {
    //when filters change, refetch with current page but if current page !==1, fire again with page===1
    //Possible refetch=2 times. Moving to diff tab & page !== 1: fire when status change, fire when page changes
    //This will not run due to actions eg delete since status/filters have not changed
    if (page !== 1) handlePageChange(1);

    //reset bedrooms to any
    setBedrooms("");
  }, [listingStatus]);

  /* ----------------------------------------
   RESET FILTERS
   ----------------------------------------*/
  const handleResetFilters = () => {
    handlePageChange(1);
    setBedrooms("");
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Intro>Listings</Intro>
        {isAgent && (
          <Button
            variant="outlined"
            onClick={handleTogglePostNewD}
            startIcon={<AddIcon />}
          >
            Post New
          </Button>
        )}
      </Box>

      {openOnboardD && (
        <Onboard open={openOnboardD} handleClose={handleToggleOnboardD} />
      )}

      {openPostNewD && (
        <PostNew open={openPostNewD} handleClose={handleTogglePostNewD} />
      )}

      {isAgent && (
        <Box pb={2} justifyContent="space-between">
          {/* <ButtonGroup
            variant="outlined"
            color="inherit"
            sx={{
              minWidth: { xs: "60vw", md: "35vw" },
              borderColor: "gray.border",
            }}
          >
            {STATUS.map((value, i) => (
              <Button
                key={value + i}
                onClick={() => setListingStatus(value)}
                fullWidth
                sx={{
                  color:
                    value === listingStatus ? "primary.main" : "muted.main",
                  borderColor: "gray.border",
                  textTransform: "none",
                  whiteSpace: "nowrap",
                }}
              >
                {value === "Unavailable" ? "Not available" : value}
              </Button>
            ))}
          </ButtonGroup> */}

          <Box sx={{ borderBottom: 1, borderColor: "dull.light" }}>
            <Tabs
              sx={{ maxWidth: "85vw" }}
              value={tabValue}
              onChange={handleTabChange}
              aria-label="basic tabs example"
              textColor="primary"
              indicatorColor="primary"
              variant="scrollable"
              allowScrollButtonsMobile //Present scroll buttons always regardless of the viewport width on mobile//keep this
            >
              {STATUS.map((value, i) => (
                <MyTab
                  label={
                    <Typography pl={1}>
                      {/* {value === "Unavailable" ? "Not available" : value}{" "} */}
                      {value}
                    </Typography>
                  }
                  value={value}
                />
              ))}
            </Tabs>
          </Box>
        </Box>
      )}

      {isAgent && (
        <Box py={2} display="flex" gap={2} flexWrap="wrap">
          {BEDROOMS.map((bedroom, i) => {
            const label = bedroom;
            return (
              <Chip
                key={i}
                onClick={() => setBedrooms(bedroom)}
                label={bedroom === "" ? "Any" : label}
                color={bedroom === bedrooms ? "primary" : "default"}
                variant="filled"
                // size="small"
                sx={{ px: 1.5 }}
              />
            );
          })}
        </Box>
      )}

      <Box py={2}>
        {isFetching ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          <Typography color="muted.main">
            {!!data?.total && `${data?.total} results`}
          </Typography>
        )}
      </Box>

      <Box minHeight="55vh">
        <Grid2 container spacing={1.5} columns={{ xs: 4, sm: 8, md: 12 }}>
          {listingsData.map((listing) => (
            <Grid2 key={listing?._id} xs={4} sm={4} md={4}>
              <Listing listing={listing} listingStatus={listingStatus} />
            </Grid2>
          ))}
        </Grid2>

        {!data?.total && (
          <Box
            width="100%"
            minHeight="55vh"
            display="flex"
            justifyContent="center"
            alignItems="center"
            rowGap={3}
            flexDirection="column"
          >
            {!isAgent && (
              <>
                <IconButton onClick={handleToggleOnboardD}>
                  <AddIcon fontSize="large" />
                </IconButton>

                <Typography color="muted.main">
                  Post rentals and earn as an agent
                </Typography>

                <Typography color="muted.main">
                  To get started, click the button below and follow the steps
                </Typography>

                <Button variant="outlined" onClick={handleToggleOnboardD}>
                  Get started
                </Button>
              </>
            )}

            {isAgent && !isFetching && (
              <>
                <ReportOutlinedIcon fontSize="large" />

                <Typography color="muted.main">No listings found</Typography>

                {/* <Typography color="muted.main">
                  You can reset active filters in case listings aren't showing
                </Typography> */}

                <Box display="flex" columnGap={3}>
                  <Button
                    variant="outlined"
                    onClick={handleResetFilters}
                    color="secondary"
                    startIcon={<SettingsBackupRestoreIcon />}
                  >
                    Reset filters
                  </Button>
                  <Button
                    startIcon={<AddIcon />}
                    variant="outlined"
                    onClick={handleTogglePostNewD}
                  >
                    Post New
                  </Button>
                </Box>
              </>
            )}
          </Box>
        )}
      </Box>

      {isAgent && (
        <Box py={4}>
          <MUIPagination
            count={totalPages}
            page={page}
            //redirect="/listings?page" //when using render item
            changePage={handlePageChange}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
          />
        </Box>
      )}
    </Box>
  );
};

export default ListingsList;
