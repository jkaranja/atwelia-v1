import { Button, CircularProgress, Typography } from "@mui/material";
import Box from "@mui/system/Box";
import { useEffect, useState } from "react";
import ReportOutlinedIcon from "@mui/icons-material/ReportOutlined";

import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";

import Intro from "../../../components/Intro";
import MUIPagination from "../../../components/MUIPagination";
import useDebounce from "../../../hooks/useDebounce";
import useTitle from "../../../hooks/useTitle";
import { IListing } from "../../../types/listing";
import FavoriteItem from "./FavoriteItem";
import { IFavorite, useGetFavoritesQuery } from "./favoriteApiSlice";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

const FavoriteList = () => {
  useTitle("Favorites");
  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [favorites, setFavorites] = useState<IFavorite[]>([]);

  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");

  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  /* ----------------------------------------
   PAGINATION
   ----------------------------------------*/
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  /* -------------------------------------------------------------
   FETCH FAVORITE LISTINGS
   ----------------------------------------------------------------*/
  const {
    currentData: data,
    isFetching,
    isSuccess,
    isError,
    error,
    refetch,
  } = useGetFavoritesQuery(
    { itemsPerPage, page },
    {
      //pollingInterval: 15000,
      //refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  //store results in states
  useEffect(() => {
    //update the other states
    setFavorites(data?.favorites || []);
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
   ACTIONS-> CURRENT PAGE - 1
   ----------------------------------------*/
  useEffect(() => {
    //when action is performed eg delete & current page not 1st page and results are zero for current page, move to 1 page back: refetch with page-1
    //This will not fire when moving to a diff tab while page was not 1. B4 result for refetch triggered by status change returns, page is already is already update below to 1
    if (page !== 1 && isError) {
      handlePageChange(page - 1);
    }
  }, [isError]);

  return (
    <Box pt={4}>
      <Typography variant="h5">Favorites</Typography>

      <Box py={2}>
        {isFetching ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          <Typography color="muted.main">
            {!!data?.total && `${data?.total} results`}
          </Typography>
        )}
      </Box>

      <Box minHeight="65vh">
        <Grid2 container spacing={1.5} columns={{ xs: 4, sm: 8, md: 12, lg: 12 }}>
          {favorites.map((favorite) => (
            <Grid2 key={favorite?._id} xs={4}   lg={3}>
              <FavoriteItem favorite={favorite} />
            </Grid2>
          ))}
        </Grid2>

        {!data?.total && !isFetching && (
          <Box
            width="100%"
            minHeight="65vh"
            display="flex"
            justifyContent="center"
            alignItems="center"
            rowGap={3}
            flexDirection="column"
          >
            <ReportOutlinedIcon fontSize="large" />

            <Typography>No favorites found</Typography>

            <Typography>
              To add items to favorites, click the heart icon when browsing
              through listings
            </Typography>

            <Button variant="outlined" onClick={() => navigate("/")}>
              Browse listings
            </Button>
          </Box>
        )}
      </Box>

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
    </Box>
  );
};

export default FavoriteList;
