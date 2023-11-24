import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Box,
  CardActionArea,
  CardHeader,
  IconButton,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useRemoveFavoriteMutation } from "./favoriteApiSlice";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import ShareIcon from "@mui/icons-material/Share";
import {
  FacebookShareButton,
  FacebookIcon,
  WhatsappIcon,
  WhatsappShareButton,
  FacebookShareCount,
} from "react-share";
import { useLocation } from "react-router-dom";
import { IListing } from "../../../types/listing";
import LaunchIcon from "@mui/icons-material/Launch";
import { IMAGE_ROOT } from "../../../constants/paths";
import { BASE_URL } from "../../../config/urls";
import ViewLive from "../view/ViewLive";

type FavoriteItemProps = {
  favorite: { _id: string; listing: IListing };
};

const FavoriteItem = ({ favorite }: FavoriteItemProps) => {
  const { pathname, search } = useLocation();

  const [removeFavorite, { isLoading }] = useRemoveFavoriteMutation();

  //dialogs
  const [openViewD, setOpenViewD] = useState(false);
  const handleToggleViewD = () => setOpenViewD((prev) => !prev);

  return (
    <Box>
      {openViewD && (
        <ViewLive
          open={openViewD}
          handleClose={handleToggleViewD}
          id={favorite.listing?._id}
        />
      )}

      <Card sx={{ minHeight: 180 }}>
        <CardActionArea onClick={handleToggleViewD}>
          <Box height={150} position="relative">
            <img
              width="100%"
              src={`${IMAGE_ROOT}/${favorite.listing?.featuredImage?.filename}`}
              alt={favorite.listing?.featuredImage?.filename}
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
              <Tooltip title="Remove from favorites">
                <IconButton
                  aria-label="share"
                  size="small"
                  disabled={isLoading}
                  onClick={(e) => {
                    //prevent event bubbling
                    e.stopPropagation(); // This will prevent any synthetic events from firing after this one(do  not open listing)

                    removeFavorite(favorite._id);
                  }}
                  sx={{
                    bgcolor: "dull.main",
                    height: 27,
                    width: 27,
                    borderRadius: "50%",
                  }}
                >
                  {isLoading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <FavoriteIcon color="error" fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </CardActionArea>

        <CardHeader
          title={
            <Typography gutterBottom variant="h5" component="span">
              {favorite.listing?.bedrooms}
            </Typography>
          }
          // subheader=""
          // action={
          //   <IconButton aria-label="Actions" onClick={handleClick}>
          //     <MoreVertIcon />
          //   </IconButton>
          // }
        />
        <CardContent sx={{ py: 0 }}>
          <Typography gutterBottom variant="body2">
            {favorite.listing?.location?.description}
          </Typography>

          <Typography gutterBottom variant="h6">
            ${favorite.listing?.price}/mo
          </Typography>
        </CardContent>

        <CardActions sx={{ justifyContent: "space-between", px: 2, py: 0 }}>
          <Tooltip title="Share on Facebook">
            <FacebookShareButton
              url={`${BASE_URL + pathname + search}`} //window./location.href
              quote={`${favorite.listing?.bedrooms}, Rent $${favorite.listing?.price}, in ${favorite.listing?.location?.description} `}
              hashtag={`#${favorite.listing?.bedrooms}`}
            >
              {/* <FacebookIcon size={32} round /> */}
              <ShareIcon />
            </FacebookShareButton>
          </Tooltip>
          <Tooltip title="View listing">
            <IconButton onClick={handleToggleViewD} color="inherit">
              <LaunchIcon />
            </IconButton>
          </Tooltip>
        </CardActions>
      </Card>
    </Box>
  );
};

export default FavoriteItem;
