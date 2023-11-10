import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CloseIcon from "@mui/icons-material/Close";
import StarIcon from "@mui/icons-material/Star";
import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  ListItem,
  Typography,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { format } from "date-fns";
import SkeletonItem from "../../../components/SkeletonItem";
import { IMAGE_ROOT, PROFILE_PIC_ROOT } from "../../../constants/paths";
import { IProfile } from "../../../types/user";
import { useGetRelatedListingsQuery } from "./viewApiSlice";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

type ProfileProps = {
  open: boolean;
  handleClose: () => void;
  profile: IProfile;
};

const Profile = ({ open, handleClose, profile }: ProfileProps) => {
  /* ----------------------------------------
   FETCH RELATED LISTINGS
   ----------------------------------------*/
  const {
    currentData: related,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetRelatedListingsQuery(profile.user._id ?? skipToken, {
    //pollingInterval: 15000,
    //refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  if (!profile) return <Typography>Loading...</Typography>;

  return (
    <Dialog
      fullWidth //works together with max width
      maxWidth="md" //default is small
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" sx={{ p: 0 }}>
        <Box display="flex" justifyContent="flex-end">
          <IconButton size="large" color="default" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box bgcolor="dull.main" borderRadius={1} p={2} mt={2} mb={4}>
          <Card>
            <CardHeader
              avatar={
                <Avatar
                  variant="rounded"
                  sx={{ height: 70, width: 70 }}
                  alt={profile.user?.username}
                  src={`${PROFILE_PIC_ROOT}/${profile?.profilePic?.filename}`}
                />
              }
              title={
                <Typography variant="h6">{profile.user.username}</Typography>
              }
              subheader={
                <Box display="flex" flexDirection={{ xs: "column", md: "row" }}>
                  <ListItem>
                    <StarIcon color="warning" fontSize="small" />
                    <Typography variant="body1" px={1}>
                      {profile.rating?.toFixed(1) || "No rating"}
                    </Typography>
                  </ListItem>

                  <ListItem>
                    <BookmarkBorderOutlinedIcon />
                    <Typography>
                      {profile.reviewCount || "0"} reviews
                    </Typography>
                  </ListItem>

                  <ListItem>
                    <CalendarTodayIcon fontSize="small" />
                    <Typography px={1}>
                      Joined{" "}
                      {format(new Date(profile.user.createdAt), "dd MMM, yyyy")}{" "}
                    </Typography>
                  </ListItem>
                </Box>
              }
            />
          </Card>
        </Box>

        <Typography variant="h6">
          What people say about {profile.user?.username}
        </Typography>

        <Box display="flex" overflow="auto" gap={3} py={3} mb={3}>
          {!profile.reviews?.length && (
            <Typography color="muted.main">No reviews</Typography>
          )}
          {profile.reviews?.map((review, i) => (
            <Card variant="outlined" sx={{ minWidth: 250 }} key={review._id}>
              <CardContent>
                <Typography>
                  "{review.comment.slice(0, 200)}
                  {review.comment.length > 200 && "..."}
                </Typography>
              </CardContent>
              <CardActions sx={{ display: "block" }}>
                <CardHeader
                  avatar={
                    <Avatar
                      alt={review.postedBy?.username}
                      src={`${PROFILE_PIC_ROOT}/${review.postedBy?.profile?.profilePic?.filename}`}
                    />
                  }
                  title={review.postedBy.username}
                  subheader={format(new Date(review.createdAt), "dd MMM, yyyy")}
                  action={
                    <Box
                      display="flex"
                      alignItems="center"
                      columnGap={0.1}
                      justifyContent="flex-end"
                    >
                      <StarIcon color="warning" fontSize="small" />
                      <Typography variant="body1">
                        {review.rating.toFixed(1)}
                      </Typography>
                    </Box>
                  }
                />
              </CardActions>
            </Card>
          ))}
        </Box>

        <Typography variant="h6" py={3}>
          Other listings from {profile.user?.username}
        </Typography>

        <Grid2 container spacing={1.5} columns={{ xs: 4, sm: 8 }}>
          {!related?.length && !isFetching && (
            <Typography color="muted.main">No listings</Typography>
          )}
          {related?.map((listing, i) => (
            <Grid2 key={listing?._id} xs={4}>
              <Card
                variant="outlined"
                sx={{ minHeight: 180 }}
                key={listing._id}
              >
                <CardActionArea
                  onClick={() => window.open(`/?id=${listing._id}`)}
                >
                  <CardMedia
                    component="img"
                    sx={{ height: 150 }}
                    image={`${IMAGE_ROOT}/${listing.featuredImage?.filename}`}
                    alt={listing.featuredImage?.filename}
                  />
                  <CardContent>
                    <Typography variant="h5" pt={1}>
                      {listing.bedrooms}
                    </Typography>

                    <Typography gutterBottom variant="body2">
                      {listing.location?.description}
                    </Typography>

                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography variant="h6" component="span">
                        Ksh {listing.price}/mo
                      </Typography>
                      {/* <Typography
                      variant="body2"
                      color="text.secondary"
                      component="span"
                    >
                      {format(new Date(listing.updatedAt), "dd MMM, yyyy")}
                    </Typography> */}
                    </Box>
                  </CardContent>
                  <CardActions></CardActions>
                </CardActionArea>
              </Card>
            </Grid2>
          ))}

          {!related?.length &&
            isFetching &&
            [...Array(3)].map((elem, i) => (
              <Grid2 key={i} xs={4}>
                <SkeletonItem />
              </Grid2>
            ))}
        </Grid2>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 4 }}></DialogActions>
    </Dialog>
  );
};

export default Profile;
