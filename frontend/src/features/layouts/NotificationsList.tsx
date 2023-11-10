import {
  Avatar,
  Chip,
  ListItemAvatar,
  ListItemSecondaryAction,
  Typography,
} from "@mui/material";
import ListItemIcon from "@mui/material/ListItemIcon";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { INotificationResult } from "../notifications/notificationsApiSlice";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import MessageOutlinedIcon from "@mui/icons-material/MessageOutlined";
import { TourStatus } from "../../types/tour";
import { useMemo } from "react";
import { setRole } from "../auth/authSlice";
import { Role } from "../../types/user";

type NotificationsListProps = {
  notifications: INotificationResult;
};

const NotificationsList = ({ notifications }: NotificationsListProps) => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const notification = useMemo(() => {
    return notifications?.tours?.reduce(
      (acc, current) => {
        if (current.tourStatus === TourStatus.Unconfirmed) {
          acc.unconfirmed += 1;
        }
        if (current.tourStatus === TourStatus.Rescheduled) {
          acc.rescheduled += 1;
        }
        if (current.tourStatus === TourStatus.Upcoming) {
          acc.upcoming += 1;
        }
        return acc;
      },
      { unconfirmed: 0, rescheduled: 0, upcoming: 0 }
    );
  }, [notifications]);

  return (
    <Box>
      <List sx={{ py: 0, minWidth: 370 }}>
        <ListItem
          sx={{ pt: 0, pb: 1 }}
          dense
          divider
          //   secondaryAction={
          //     <Chip
          //       color="warning"
          //       label={`${10} New`}
          //       size="small"
          //       variant="outlined"
          //     />
          //   }
        >
          <ListItemText
            primary={<Typography variant="h6">Notifications</Typography>}
          />
        </ListItem>

        {Object.entries(notification || {}).map(([status, count], index) => {
          const key = status as keyof typeof notification;

          if (!count) return;

          return (
            <ListItem key={status + index} disablePadding divider>
              <ListItemButton
                onClick={() => {
                  if (status !== "upcoming") {
                    //switch role to agent
                    dispatch(setRole(Role.Agent));                   
                  }
                   navigate("/tours");
                }}
              >
                <ListItemIcon>
                  <CalendarMonthIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography>
                      {status === "unconfirmed" && "You have new tour requests"}
                      {status === "upcoming" && "Tour requests confirmed"}
                      {status === "rescheduled" && "Tour requests rescheduled"}
                    </Typography>
                  }
                  //secondary={<Typography>{}</Typography>}
                />
                <ListItemSecondaryAction>
                  <Chip label={count} color="warning" size="small" />
                </ListItemSecondaryAction>
              </ListItemButton>
            </ListItem>
          );
        })}

        {!!notifications?.inbox?.length && (
          <ListItem
            disablePadding
            //divider={index !== notifications.inbox.length - 1}
          >
            <ListItemButton onClick={() => navigate("/messages")}>
              <ListItemIcon>
                <MessageOutlinedIcon />
              </ListItemIcon>
              <ListItemText
                primary={<Typography>You have new unread messages</Typography>}
                //secondary={<Typography>new</Typography>}
              />
              <ListItemSecondaryAction>
                <Chip
                  label={notifications.inbox.length}
                  color="warning"
                  size="small"
                />
              </ListItemSecondaryAction>
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </Box>
  );
};

export default NotificationsList;
