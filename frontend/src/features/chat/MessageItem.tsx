import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography from "@mui/material/Typography";

import { Button, CircularProgress } from "@mui/material";

import ListItemText from "@mui/material/ListItemText";
import { useEffect } from "react";

import DoneAllOutlinedIcon from "@mui/icons-material/DoneAllOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";

import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import FilePresentIcon from "@mui/icons-material/FilePresent";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";

import { toast } from "react-toastify";

//import { BASE_URL } from "../../../config/urls";
import { useAppSelector } from "../../hooks/useAppSelector";
import useAuth from "../../hooks/useAuth";
import useFileDownload from "../../hooks/useFileDownload";
import { IMessage, useDeleteMessageMutation } from "./chatApiSlice";
import { PROFILE_PIC_ROOT } from "../../constants/paths";
import formatChatDate from "../../common/formatChatDate";

type MessageItemProps = {
  message: IMessage;
  setMessagesList: React.Dispatch<React.SetStateAction<IMessage[]>>;
};

const MessageItem = ({ message, setMessagesList }: MessageItemProps) => {
  const [handleDownload, isDownloading] = useFileDownload();

  const [deleteMessage, { data, isSuccess, isError, error, isLoading }] =
    useDeleteMessageMutation();

  const [_, _id] = useAuth();

  const isMe = message.sender?._id === _id;

  //feedback
  useEffect(() => {
    if (isError) toast.error(error as string);

    //remove message from the list//we're not using automated re-fetching based on tag invalidation
    if (isSuccess) {
      setMessagesList((prev) =>
        prev.filter((current) => current._id !== message._id)
      );
    }

    //if (isSuccess) toast.success(data?.message);

    return () => toast.dismiss();
  }, [isError, isSuccess]);

  return (
    <Box display="flex" justifyContent={isMe ? "flex-end" : "flex-start"}>
      <ListItem alignItems="flex-start" sx={{ width: "auto" }} dense>
        <ListItemIcon>
          <Avatar
            alt={message.sender?.username}
            src={`${PROFILE_PIC_ROOT}/${message.sender?.profile?.profilePic?.filename}`}
            sx={{ width: 35, height: 35 }}
          />
        </ListItemIcon>
        <ListItemText
          primary={
            <Box
              py={1}
              px={2}
              bgcolor={isMe ? "secondary.light" : "white"}
              position="relative"
              color={isMe ? "white" : ""}
              boxShadow={1}
              borderRadius={isMe ? "8px 0px 8px 8px" : " 0px 8px 8px"}
            >
              <Typography>{message.content}</Typography>

              {isMe && (
                <Box position="absolute" top={-3} right={-3}>
                  <IconButton
                    size="small"
                    onClick={() => deleteMessage(message._id)}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <CircularProgress size={10} color="primary" />
                    ) : (
                      <ClearOutlinedIcon sx={{ fontSize: 15 }} color="error" />
                    )}
                  </IconButton>
                </Box>
              )}
            </Box>
          }
          secondary={
            <Box
              display="flex"
              py={0.5}
              justifyContent={isMe ? "flex-end" : "flex-start"}
              alignItems="center"
            >
              <Box>
                {message.files?.map((file, i) => (
                  <Button
                    onClick={() => handleDownload(file)}
                    sx={{
                      py: 0,
                      px: 1,
                      textTransform: "none",
                    }}
                    color="secondary"
                    size="small"
                    startIcon={<FilePresentIcon />}
                    endIcon={<DownloadOutlinedIcon color="primary" />}
                  >
                    <Typography
                      variant="caption"
                      color="secondary.main"
                    >{`${file.filename?.slice(0, 20)}...`}</Typography>
                  </Button>
                ))}
              </Box>
              {isMe &&
                (message.isRead ? (
                  <DoneAllOutlinedIcon sx={{ fontSize: 15 }} color="success" />
                ) : (
                  <CheckOutlinedIcon sx={{ fontSize: 15 }} color="disabled" />
                ))}

              <Typography px={1} variant="body2">
                {formatChatDate(new Date(message.createdAt))}
              </Typography>
            </Box>
          }
        />
      </ListItem>
    </Box>
  );
};

export default MessageItem;
