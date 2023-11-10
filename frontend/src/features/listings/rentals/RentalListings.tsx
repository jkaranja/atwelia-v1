import { CircularProgress, Typography, Button } from "@mui/material";
import Box from "@mui/system/Box";
import React, { useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import ReportOutlinedIcon from "@mui/icons-material/ReportOutlined";
import MUIPagination from "../../../components/MUIPagination";
import SkeletonItem from "../../../components/SkeletonItem";
import { useAppSelector } from "../../../hooks/useAppSelector";
import useDebounce from "../../../hooks/useDebounce";
import useTitle from "../../../hooks/useTitle";
import { IListing } from "../../../types/listing";
import { selectCurrentToken } from "../../auth/authSlice";
import Map from "../../maps/Map";
import { IFavorite, useGetFavoritesQuery } from "../favorites/favoriteApiSlice";
import Listing from "./Listing";
import SearchBar from "./SearchBar";
import { useGetAllListingsQuery } from "./rentalApiSlice";
import { resetFilters, selectSearchFilters } from "./rentalSlice";

const RentalListings = () => {
  useTitle("Rentals");
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useAppSelector(selectSearchFilters);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = useAppSelector(selectCurrentToken);

  const [listingsData, setListingsData] = useState<IListing[]>([]);

  const [favorites, setFavorites] = useState<IFavorite[]>([]);

  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");

  /* ----------------------------------------
   PAGINATION
   ----------------------------------------*/
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(18);

  /* -------------------------------------------------------------
   FETCH FAVORITE->when token is valid
   ----------------------------------------------------------------*/
  const { currentData: favoriteData } = useGetFavoritesQuery(undefined, {
    skip: !token,
    // pollingInterval: 1000 * 5,//in ms
    // refetchOnFocus: true,
    //last fetched time > 10 secs, refetch//use true |10
    refetchOnMountOrArgChange: true, //in secs
  });
  useEffect(() => {
    //update the other states
    setFavorites(favoriteData?.favorites || []);
  }, [favoriteData]);

  /* -------------------------------------------------------------
   FETCH LISTINGS
   ----------------------------------------------------------------*/
  const {
    currentData: data, //The latest returned result for the current hook arg, if present.
    data: staleData, //The latest returned result regardless of hook arg, if present.
    isFetching,
    isSuccess,
    isError,
    error,
    refetch,
    isLoading,
  } = useGetAllListingsQuery(
    { itemsPerPage, page, filters },
    {
      // pollingInterval: 1000 * 5,
      // refetchOnFocus: true,
      //last fetched time > 10 secs, refetch//use true |10
      refetchOnMountOrArgChange: true, //if false, serve cached results if available or fetch(on mount + arg change). If true, force refetch-> refetch()
    }
  );

  //store results in states
  useEffect(() => {
    //update the other states
    setListingsData(data?.listings || []);
    setTotalPages(data?.pages || 0);
  }, [data]);

  /* ----------------------------------------
   HANDLE PAGINATION
   ----------------------------------------*/
  //for custom pagination & mui onchange
  const handlePageChange = (page: number) => {
    setPage(page);
  };

  /* ----------------------------------------
   RESET TO PAGE 1 ->STATUS CHANGE, PAGE!==1
   ----------------------------------------*/
  useEffect(() => {
    //when filters change, refetch with current page but if current page !==1, fire again with page===1
    //Possible refetch=2 times. Moving to diff tab & page !== 1: fire when status change, fire when page changes
    //This will not run due to actions eg delete since status/filters have not changed
    if (page !== 1) handlePageChange(1);
  }, [filters]);

  /* ----------------------------------------
   RESET FILTERS
   ----------------------------------------*/
  const handleResetFilters = () => {
    dispatch(resetFilters());
  };

  return (
    <Box>
      <SearchBar total={data?.total || 0} />

      <Box height="88.9vh" position="relative">
        {isFetching && staleData && (
          <Box
            height="88.9vh"
            position="absolute"
            width="100%"
            top={0}
            zIndex={2}
            bgcolor="muted.dark"
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{ opacity: 0.6 }}
          >
            <CircularProgress sx={{ color: "#fff" }} />
          </Box>
        )}

        <Grid2 container justifyContent="space-between">
          <Grid2
            xs
            flexGrow={4}
            display="flex"
            px={3}
            minHeight="88vh"
            maxHeight={{ lg: "88.9vh" }}
            overflow="auto"
            flexDirection="column"
          >
            <Box display="flex" justifyContent="space-between" py={1}>
              <Typography color="muted.main">
                {!!data?.total && `${data?.total} results`}
              </Typography>
            </Box>
            <Box flexGrow={2}>
              <Grid2
                container
                spacing={1.5}
                columns={{ xs: 4, sm: 8, md: 12, lg: 8, xl: 12 }}
              >
                {listingsData.map((listing) => (
                  <Grid2 key={listing?._id} xs={4}>
                    <Listing favorites={favorites!} listing={listing} />
                  </Grid2>
                ))}

                {isLoading &&
                  [...Array(9)].map((elem, i) => (
                    <Grid2 key={i} xs={4}>
                      <SkeletonItem />
                    </Grid2>
                  ))}
              </Grid2>

              {!data?.total && !isFetching && (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  minHeight="70vh"
                  rowGap={3}
                  flexDirection="column"
                >
                  <ReportOutlinedIcon fontSize="large" />

                  <Typography color="muted.main">No listings found</Typography>

                  <Typography color="muted.main">
                    You can reset active filters to view available listings
                  </Typography>

                  <Button variant="outlined" onClick={handleResetFilters}>
                    Reset filters
                  </Button>
                </Box>
              )}
            </Box>

            <Box py={2}>
              <MUIPagination
                count={totalPages}
                page={page}
                //redirect="/listings?page" //when using render item
                changePage={handlePageChange}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
              />
            </Box>
          </Grid2>

          <Grid2 xs display={{ xs: "none", lg: "block" }} flexGrow={3}>
            <Map data={listingsData} />
          </Grid2>
        </Grid2>
      </Box>
    </Box>
  );
};

export default RentalListings;
