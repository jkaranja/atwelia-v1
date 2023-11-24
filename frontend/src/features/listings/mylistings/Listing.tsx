import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ToggleOffOutlinedIcon from "@mui/icons-material/ToggleOffOutlined";
import {
  Box,
  CardActionArea,
  CardHeader,
  IconButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { IMAGE_ROOT } from "../../../constants/paths";
import { IListing } from "../../../types/listing";
import formatListingDate from "../../../utils/formatListingDate";
import UpdateListing from "./update/UpdateListing";
import ViewListing from "../view/ViewListing";
import LaunchIcon from "@mui/icons-material/Launch";
import {
  useDeleteListingMutation,
  useUpdateStatusMutation,
} from "./listingApiSlice";

type ListingProps = {
  listing: IListing;
  listingStatus: string;
};

const Listing = ({ listing, listingStatus }: ListingProps) => {
  const [deleteListing, { isLoading: isDeleting }] = useDeleteListingMutation();

  const [
    updateStatus,
    { data, isLoading: isUpdating, isSuccess, isError, error },
  ] = useUpdateStatusMutation();

  //dialogs
  const [openViewD, setOpenViewD] = useState(false);
  const [openUpdateD, setOpenUpdateD] = useState(false);
  const handleToggleViewD = () => setOpenViewD((prev) => !prev);
  const handleToggleUpdateD = () => setOpenUpdateD((prev) => !prev);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //status feedback
  useEffect(() => {
    if (isError) toast.error(error as string);

    if (isSuccess) toast.success(data?.message);

    if (isSuccess) handleClose();//close menu
  }, [isError, isSuccess]);

  return (
    <Box>
      {openViewD && (
        <ViewListing
          open={openViewD}
          handleClose={handleToggleViewD}
          id={listing._id}
        />
      )}

      {openUpdateD && (
        <UpdateListing
          open={openUpdateD}
          handleClose={handleToggleUpdateD}
          id={listing._id}
        />
      )}

      <Card sx={{ minHeight: 180 }}>
        <CardActionArea onClick={handleToggleViewD}>
          <CardMedia
            component="img"
            sx={{ height: 150 }}
            image={`${IMAGE_ROOT}/${listing.featuredImage?.filename}`}
            alt={listing.featuredImage?.filename}
          />
        </CardActionArea>

        <CardHeader
          title={
            <Typography gutterBottom variant="h5" component="span">
              {listing.bedrooms}
            </Typography>
          }
          // subheader=""
          action={
            <IconButton aria-label="Actions" onClick={handleClick}>
              <MoreVertIcon />
            </IconButton>
          }
        />
        <CardContent sx={{ py: 0 }}>
          <Typography gutterBottom variant="body2">
            {listing.location?.description}
          </Typography>

          <Typography gutterBottom variant="h6">
            ${listing.price}/mo
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formatListingDate(new Date(listing.updatedAt))}
          </Typography>

          <Menu
            id="demo-positioned-menu"
            aria-labelledby="demo-positioned-button"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem
              //divider
              //disableG..//dense
              onClick={() =>
                updateStatus({
                  id: listing._id,
                  listingStatus:
                    listingStatus === "Draft" || listingStatus === "Unavailable"
                      ? "Available"
                      : "Unavailable",
                })
              }
            >
              <ListItemText>
                {listingStatus === "Draft" && "Publish"}
                {listingStatus === "Available" && "Mark as unavailable"}
                {listingStatus === "Unavailable" && "Mark as available"}
              </ListItemText>

              {isUpdating && <CircularProgress size={20} color="inherit" />}
            </MenuItem>
            <MenuItem onClick={()=>{
              handleToggleUpdateD();
              handleClose(); //close menu
            }}>
              <ListItemText primary="Edit" />
            </MenuItem>
            <MenuItem onClick={() => deleteListing(listing._id)}>
              <ListItemText primary="Delete" />
              {isDeleting && <CircularProgress size={20} color="inherit" />}
            </MenuItem>
          </Menu>
        </CardContent>
        <CardActions disableSpacing sx={{ justifyContent: "flex-end", py: 0 }}>
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

export default Listing;
