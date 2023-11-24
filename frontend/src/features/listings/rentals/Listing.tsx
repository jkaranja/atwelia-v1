import FavoriteIcon from "@mui/icons-material/Favorite";
import { Box, CardActionArea, IconButton, Tooltip } from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { IListing } from "../../../types/listing";
import formatListingDate from "../../../utils/formatListingDate";
import { selectCurrentToken } from "../../auth/authSlice";


import { useLocation, useSearchParams } from "react-router-dom";
import { IMAGE_ROOT } from "../../../constants/paths";
import AuthDialog from "../../auth/AuthDialog";
import {
  IFavorite,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} from "../favorites/favoriteApiSlice";
import ViewLive from "../view/ViewLive";

//The API to send messages through WhatsApp web is as follows:

//“https://web.whatsapp.com/send?phone=number&text=message&app_absent=0”

type ListingProps = {
  listing: IListing;
  favorites: IFavorite[];
};

const Listing = ({ listing, favorites }: ListingProps) => {
  const token = useAppSelector(selectCurrentToken);

  const { pathname, search } = useLocation();

  const [searchParams, setSearchParams] = useSearchParams();

  //auth
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  //dialogs
  const [openViewD, setOpenViewD] = useState(false);
  const [openAuthD, setOpenAuthD] = useState(false);
  const handleToggleAuthD = () => setOpenAuthD((prev) => !prev);

  //is listing in favorites
  const isInFavorites = () => {
    return favorites?.some((item) => item.listing?._id === listing._id);
  };

  //favorite Id of the current listing
  const extractFavoriteId = () => {
    const favorite = favorites?.find(
      (item) => item.listing?._id === listing._id
    );
    return favorite?._id;
  };

  /* -------------------------------------------------------------
   ADD TO FAVORITES
  ----------------------------------------------------------------*/
  const [addFavorite, { isLoading: isAdding }] = useAddFavoriteMutation();
  /* -------------------------------------------------------------
   REMOVE FROM FAVORITE
  ----------------------------------------------------------------*/
  const [removeFavorite, { isLoading: isRemoving }] =
    useRemoveFavoriteMutation();

  const handleFavoriteClick = () => {
    if (isInFavorites()) return removeFavorite(extractFavoriteId()!);
    return addFavorite(listing._id);
  };

  //open view dialog
  const handleToggleView = () => {
    openViewD ? setSearchParams() : setSearchParams({ id: listing._id });

    setOpenViewD((prev) => !prev);
  };

  useEffect(() => {
    //on mount, check if the url contain id in the query string
    //used for opening a listing while navigating to listings page using external link or other pages
    if (searchParams.get("id") === listing._id) return setOpenViewD(true);
  }, []);

  //auth & retry add to favorites
  useEffect(() => {
    if (token && isAuthenticated) {
      handleToggleAuthD();
      handleFavoriteClick();
    }
  }, [token, isAuthenticated]);

  return (
    <Box>
      {openViewD && (
        <ViewLive
          open={openViewD}
          handleClose={handleToggleView}
          id={listing._id}
        />
      )}

      {openAuthD && (
        <AuthDialog
          open={openAuthD}
          handleClose={handleToggleAuthD}
          setIsAuthenticated={setIsAuthenticated}
        />
      )}

      <Card sx={{ minHeight: 180 }}>
        <CardActionArea onClick={handleToggleView}>
          {/* <SwipeableViews
            images={listing.listingImages}
            isInFavorites={isInFavorites}
            handleFavoriteClick={handleFavoriteClick}
            handleToggleAuthD={handleToggleAuthD}
            listing={listing}
            isAdding={isAdding}
            isRemoving={isRemoving}
          /> */}

          <Box height={150} position="relative">
            <img
              width="100%"
              src={`${IMAGE_ROOT}/${listing.featuredImage?.filename}`}
              alt={listing.featuredImage?.filename}
              style={{ objectFit: "cover", height: 150 }}
            /> 
            <Box
              position="absolute"
              width="100%"
              px={1}
              py={2}
              top={0}
              display="flex"
              justifyContent="flex-end"
              alignItems="center"
            >
              <Tooltip
                title={
                  isInFavorites() ? "Remove from favorites" : "Add to favorites"
                }
              >
                <IconButton
                  aria-label="share"
                  size="small"
                  disabled={isAdding || isRemoving}
                  onClick={(e) => {
                    //prevent event bubbling
                    e.stopPropagation(); // This will prevent any synthetic events from firing after this one(do  not open listing)

                    if (!token) return handleToggleAuthD();

                    handleFavoriteClick();
                  }}
                  sx={{
                    bgcolor: "dull.main",
                    height: 27,
                    width: 27,
                    borderRadius: "50%",
                  }}
                >
                  <FavoriteIcon
                    color={isInFavorites() ? "error" : "inherit"}
                    fontSize="small"
                  />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <CardContent sx={{ flexDirection: "row", pb: 1 }}>
            <Typography variant="h5">{listing.bedrooms}</Typography>

            <Typography gutterBottom variant="body2">
              {listing.location?.description}
            </Typography>

            <Typography variant="h6">${listing.price}/mo</Typography>
            <Typography variant="body2" color="text.secondary">
              {formatListingDate(new Date(listing.updatedAt))}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions
          disableSpacing
          sx={{ justifyContent: "space-between", p: 0 }}
        >
          {/* <Tooltip
            title={
              isInFavorites() ? "Remove from favorites" : "Add to favorites"
            }
          >
            <IconButton
              aria-label="share"
              size="small"
              disabled={isAdding || isRemoving}
              onClick={!token ? handleToggleAuthD : handleFavoriteClick}
            >
              <FavoriteIcon color={isInFavorites() ? "error" : "inherit"} />
            </IconButton>
          </Tooltip> */}
          <Box>
            {/* <Tooltip title="Share on Facebook">
              <FacebookShareButton
                url={`${BASE_URL + pathname + search}`} //window./location.href
                quote={`${listing.bedrooms}, Rent $${listing.price}, in ${listing.location?.description} `}
                hashtag={`#${listing.bedrooms}`}
              >
                  <FacebookIcon size={32} round /> //show eg fb icon or show mui shareIcon
                <ShareIcon />
              </FacebookShareButton>
            </Tooltip> */}

            {/* <WhatsappShareButton url={"https://www.example.com"} title="">
              <WhatsappIcon size={23} round={true} />
            </WhatsappShareButton> */}
          </Box>
        </CardActions>
      </Card>
    </Box>
  );
};

export default Listing;
