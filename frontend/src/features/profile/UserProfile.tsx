import LockOpenIcon from "@mui/icons-material/LockOpen";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Paper,
  Tabs,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PaymentIcon from "@mui/icons-material/Payment";
import StarIcon from "@mui/icons-material/Star";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { useNavigate, useSearchParams } from "react-router-dom";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import Intro from "../../components/Intro";
import MyTab from "../../components/MyTab";
import TabPanel from "../../components/TabPanel";
import useTitle from "../../hooks/useTitle";
import { useGetProfileQuery, useGetUserQuery } from "../auth/userApiSlice";
import PhoneIcon from "@mui/icons-material/Phone";
import DoneIcon from "@mui/icons-material/Done";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PaymentOutlinedIcon from "@mui/icons-material/PaymentOutlined";
import useAuth from "../../hooks/useAuth";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import UpdateProfile from "./UpdateProfile";
import { PROFILE_PIC_ROOT } from "../../constants/paths";
import { format } from "date-fns";
import Onboard from "../onboarding/Onboard";
import { AccountStatus, Role } from "../../types/user";

const UserProfile = () => {
  useTitle("Profile");

  const [roles, _id, accountStatus] = useAuth();

   const isAgent = roles.includes(Role.Agent);

  const navigate = useNavigate();

  //dialogs
  const [openProfileD, setOpenProfileD] = useState(false);
  const handleToggleProfileD = () => setOpenProfileD((prev) => !prev);
  const [openOnboardD, setOpenOnboardD] = useState(false);
  const handleToggleOnboardD = () => setOpenOnboardD((prev) => !prev);

  const {
    data: profile,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetProfileQuery(_id ?? skipToken, {
    // pollingInterval: 15000,
    // refetchOnFocus: true,
    // refetchOnMountOrArgChange: true,
  });

  if (!profile?.user) return <Typography py={3}>Loading...</Typography>;

  return (
    <Box>
      {openProfileD && (
        <UpdateProfile
          profile={profile!}
          open={openProfileD}
          handleClose={handleToggleProfileD}
        />
      )}

      {openOnboardD && (
        <Onboard open={openOnboardD} handleClose={handleToggleOnboardD} />
      )}

      <Intro>Profile</Intro>

      <Box>
        <Card>
          <CardMedia
            component="img"
            sx={{ height: 200 }}
            image="https://cdn.pixabay.com/photo/2016/09/08/12/00/stars-1654074_1280.jpg"
            alt="listing"
          />
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
              <Box
                display="flex"
                justifyContent="space-between"
                flexDirection={{ xs: "column", md: "row" }}
                alignItems={{ xs: "flex-start", md: "center" }}
                rowGap={1}
              >
                <ListItem>
                  <StarIcon color="warning" fontSize="small" />
                  <Typography variant="body1" px={1}>
                    {profile.rating?.toFixed(1) || "No rating"}
                  </Typography>
                </ListItem>

                <ListItem>
                  <BookmarkBorderOutlinedIcon />
                  <Typography> {profile.reviewCount || "0"} reviews</Typography>
                </ListItem>

                <ListItem>
                  <CalendarTodayIcon fontSize="small" />
                  <Typography px={1}>
                    Joined{" "}
                    {format(new Date(profile.user.createdAt), "dd MMM, yyyy")}{" "}
                  </Typography>
                </ListItem>

                {isAgent ? (
                  <Button
                    variant="contained"
                    onClick={handleToggleProfileD}
                    sx={{ whiteSpace: "nowrap", minWidth: 120 }}
                  >
                    Edit profile
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleToggleOnboardD}
                    sx={{ whiteSpace: "nowrap", minWidth: 200 }}
                  >
                    Create Agent Profile
                  </Button>
                )}
              </Box>
            }
          />
        </Card>
      </Box>

      <Grid2
        container
        justifyContent="space-between"
        spacing={5}
        flexDirection={{ xs: "column", lg: "row" }}
        py={2}
      >
        <Grid2 xs flexGrow={2}>
          <Card variant="outlined">
            <CardHeader
              title={<Typography variant="h6">About Me</Typography>}
            />
            <CardContent>
              <Typography>
                {profile.bio ? `" ${profile.bio}` : "No bio yet!"}
              </Typography>

              {/* <ListItem>
                <ListItemIcon>
                  <DoneIcon />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography> Status: Active</Typography>}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <PersonOutlineOutlinedIcon />
                </ListItemIcon>
                <ListItemText
                  primary={<Typography>Roles: Developer</Typography>}
                />
              </ListItem> */}

              <Typography variant="h6" py={3}>
                Contacts
              </Typography>
              <ListItem>
                <ListItemIcon>
                  <PhoneIcon />
                </ListItemIcon>

                <ListItemText
                  primary={
                    <Typography>
                      Phone Numbers: {profile.phoneNumbers?.join(", ")}
                    </Typography>
                  }
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <EmailOutlinedIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography>
                      Email: {profile.user.email || "No email"}
                    </Typography>
                  }
                />
              </ListItem>

              <Typography variant="h6" py={3}>
                Tour fees
              </Typography>
              <ListItem>
                <ListItemIcon>
                  <PaymentOutlinedIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography>
                      Ksh: {profile.tourFee || "Not provided yet!"}
                    </Typography>
                  }
                />
              </ListItem>
            </CardContent>
          </Card>
        </Grid2>

        <Grid2 xs flexGrow={3}>
          <Typography variant="h6">Reviews</Typography>

          <Box display="flex" overflow="auto" gap={3} py={5}>
            {!profile.reviews?.length && (
              <Typography color="muted.main">No reviews found</Typography>
            )}

            {profile.reviews?.map((review, i) => (
              <Card variant="outlined" sx={{ minWidth: 300 }} key={review._id}>
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
                    subheader={format(
                      new Date(review.createdAt),
                      "dd MMM, yyyy"
                    )}
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
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default UserProfile;
