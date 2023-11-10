import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useEffect, useState } from "react";
import ChatHeader from "./ChatHeader";

import Intro from "../../components/Intro";

import { useAppDispatch } from "../../hooks/useAppDispatch";
import useTitle from "../../hooks/useTitle";
import { IUser } from "../../types/user";
import ChatBox from "./ChatBox";
import ChatsList from "./ChatsList";
import { useLocation } from "react-router-dom";
import { IChat, useMarkAsReadMutation } from "./chatApiSlice";
import {
  INotificationResult,
  useClearInboxMutation,
} from "../notifications/notificationsApiSlice";
import { selectNotifications } from "../notifications/notificationSlice";
import { useAppSelector } from "../../hooks/useAppSelector";

const Chat = () => {
  useTitle("Messages");

  const dispatch = useAppDispatch();

  const notifications = useAppSelector(selectNotifications);

  const location = useLocation();

  const currentRecipient = location.state?.recipient || null;

  const [recipient, setRecipient] = useState<IUser | null>(
    currentRecipient || null
  );

  const [chat, setChat] = useState<IChat | null>(null);

  const [clearInbox, { isLoading: isClearing }] = useClearInboxMutation();

  const [markAsRead, { isLoading: isUpdating }] = useMarkAsReadMutation();

  const handleChatChange = (chat: IChat) => {
    setChat(chat);
  };

  const handleRecipientChange = (recipient: IUser) => {
    setRecipient(recipient);
  };

  //clear notification for current chat
  useEffect(() => {
    if (chat) clearInbox(chat._id);
  }, [chat]);

  //mark all unread messages for the other participant/recipient as read
  useEffect(() => {
    if (chat) markAsRead(chat._id);
  }, [chat]);

  return (
    <Box pb={4}>
      <Intro>Messages</Intro>
      <Box>
        <Grid2
          container
          justifyContent="space-between"
          flexDirection={{ xs: "column", lg: "row" }}
          boxShadow={{ lg: 1 }}
        >
          <Grid2
            xs
            xl={3}
            pr={0}
            boxShadow={{ xs: 1, lg: 0 }}
            mb={{ xs: 4, lg: 0 }}
          >
            <Typography px={2} py={1} variant="h6">
              Recent
            </Typography>
            <Divider />
            <Box>
              <ChatsList
                handleChatChange={handleChatChange}
                handleRecipientChange={handleRecipientChange}
                notifications={notifications!}
              />
            </Box>
          </Grid2>

          <Grid2 xs p={0} flexGrow={2} boxShadow={{ xs: 1, lg: 0 }}>
            {/* CHATs */}
            {chat && recipient ? (
              <Box>
                <ChatHeader recipient={recipient} />
                <Divider />
                <ChatBox chat={chat} recipient={recipient} />
              </Box>
            ) : (
              <Box
                height="75vh"
                display="flex"
                bgcolor="dull.main"
                justifyContent="center"
                alignItems="center"
              >
                <Avatar
                  sx={{
                    bgcolor: "white",
                    width: 100,
                    height: 100,
                    boxShadow: 2,
                  }}
                >
                  <ChatBubbleOutlineIcon sx={{ fontSize: 40 }} color="action" />
                </Avatar>
              </Box>
            )}
          </Grid2>
        </Grid2>
      </Box>
    </Box>
  );
};

export default Chat;
