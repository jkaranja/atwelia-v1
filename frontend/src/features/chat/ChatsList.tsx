import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Button, Chip, ListItemSecondaryAction } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { PROFILE_PIC_ROOT } from "../../constants/paths";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import useAuth from "../../hooks/useAuth";
import { IUser } from "../../types/user";
import { INotificationResult } from "../notifications/notificationsApiSlice";
import { IChat, useGetChatsQuery } from "./chatApiSlice";

type ChatsListProps = {
  handleChatChange: (arg: IChat) => void;
  handleRecipientChange: (arg: IUser) => void;
  notifications: INotificationResult;
};

const ChatsList = ({
  handleChatChange,
  handleRecipientChange,
  notifications,
}: ChatsListProps) => {
  const dispatch = useAppDispatch();

  const [chatsList, setChatsList] = useState<IChat[]>([]);

  const [_, _id] = useAuth();

  /* ----------------------------------------
   PAGINATION
   ----------------------------------------*/
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(9);

  /* -------------------------------------------------------------
   FETCH CHATS
   ----------------------------------------------------------------*/
  const {
    currentData: data,
    isFetching,
    isSuccess,
    isError,
    error,
    refetch,
  } = useGetChatsQuery(
    { itemsPerPage, page },
    {
      // skip: !token,
      //pollingInterval: 15000,
      //refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  //store chat chats in state
  useEffect(() => {
    setChatsList(data?.chats || []);
    setTotalPages(data?.pages || 0);
  }, [data]);

  /* ----------------------------------------
   HANDLE PAGINATION
   ----------------------------------------*/
  const handleNext = () => {
    setPage((prev) => prev + 1);
  };
  //handle back btn
  const handleBack = () => {
    setPage((prev) => prev - 1);
  };

  if (isFetching) return <Typography p={3}>Loading...</Typography>;

  if (isError)
    return (
      <Typography p={3} color="muted.main">
        No messages
      </Typography>
    );

  return (
    <Box position="relative" height="70vh" pb={20}>
      <List>
        {chatsList?.map((chat, index) => (
          <ListItem alignItems="flex-start" key={chat._id} disableGutters dense>
            <ListItemButton
              onClick={() => {
                handleChatChange(chat);
                handleRecipientChange(
                  chat.participants.find((elem) => elem._id !== _id)!
                );
              }}
            >
              <ListItemAvatar>
                <Avatar
                  alt={chat.latestMessage.sender?.username}
                  src={`${PROFILE_PIC_ROOT}/${chat.latestMessage.sender?.profile?.profilePic?.filename}`}
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography>{chat.latestMessage.sender?.username}</Typography>
                }
                secondary={
                  chat.latestMessage.content.length > 20
                    ? `${chat.latestMessage.content.slice(0, 20)}...`
                    : chat.latestMessage.content
                }
              />
              <ListItemSecondaryAction>
                {!!notifications?.inbox?.filter(
                  (mess) => mess.chat === chat._id
                )?.length && (
                  <Chip
                    size="small"
                    color="warning"
                    label={
                      <Typography variant="caption" color="white">
                        {notifications?.inbox?.filter(
                          (mess) => mess.chat === chat._id
                        )?.length || ""}
                      </Typography>
                    }
                  />
                )}
              </ListItemSecondaryAction>
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box
        py={1}
        position="absolute"
        bottom={0}
        display="flex"
        justifyContent="space-between"
        width="100%"
        px={2}
      >
        <Button color="inherit" disabled={page === 1} onClick={handleBack}>
          <ChevronLeftIcon />
        </Button>

        <Button
          color="inherit"
          onClick={handleNext}
          disabled={page === totalPages}
        >
          <ChevronRightIcon />
        </Button>
      </Box>
    </Box>
  );
};

export default ChatsList;
