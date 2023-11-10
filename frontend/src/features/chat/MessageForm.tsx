import AttachmentOutlinedIcon from "@mui/icons-material/AttachmentOutlined";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";

import React, { useEffect } from "react";

import { useForm } from "react-hook-form";

import { toast } from "react-toastify";

import { IUser } from "../../types/user";
import { IChat, IMessage, usePostMessageMutation } from "./chatApiSlice";
import useAuth from "../../hooks/useAuth";

// const socket = io(BASE_URL, {
//   closeOnBeforeunload: false,
// });

type MessageFormProps = {
  recipient: IUser;
  setMessagesList: React.Dispatch<React.SetStateAction<IMessage[]>>;
};

const MessageForm = ({ recipient, setMessagesList }: MessageFormProps) => {
  const [_, _id] = useAuth();

  const [postMessage, { data, error, isLoading, isSuccess, isError }] =
    usePostMessageMutation();

  type MessageFormInputs = {
    message: string;
    files: File[];
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetForm,
    watch,
  } = useForm<MessageFormInputs>();

  const watchFiles = watch("files");

  const onPostChatSubmit = async (inputs: MessageFormInputs) => {
    const formData = new FormData();
    //convert FileList to array to work with forEach
    [...inputs.files].forEach((file, i) => {
      formData.append("files", file);
    });

    formData.append("content", inputs.message);

    formData.append("recipient", recipient._id!);

    await postMessage(formData);
  };

  const handleMessageSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit(onPostChatSubmit)();
    }
  };

  //feedback
  useEffect(() => {
    if (isSuccess && data?.message) {
      resetForm({ message: "", files: [] });

      //emit new message event
      // socket.emit("new message", currentWriter?._id);

      //append message to current list//we're not using automated re-fetching based on tag invalidation
      setMessagesList((prev) => [...prev, data.message]);
    }

    if (isError) toast.error(error as string);

    //if (isSuccess) toast.success("Message sent");

    return () => toast.dismiss();
  }, [isError, isSuccess]);

  return (
    <Box>
      <TextField
        {...register("message", { required: "Enter a message" })}
        sx={{ bgcolor: "white" }}
        fullWidth
        color="secondary"
        placeholder="Enter your message..."
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton component="label" sx={{ mx: 2 }}>
                <input hidden multiple type="file" {...register("files")} />
                <AttachmentOutlinedIcon />
              </IconButton>
              {watchFiles?.length > 0 ? (
                <Chip
                  label={`${watchFiles?.length} files`}
                  color="warning"
                  variant="outlined"
                  size="small"
                  sx={{ mr: 2 }}
                  onDelete={() => resetForm({ files: [] })}
                />
              ) : (
                <></>
              )}
              <Button
                variant="contained"
                color="secondary"
                disableElevation
                onClick={handleSubmit(onPostChatSubmit)}
                disabled={isLoading}
                endIcon={
                  isLoading && <CircularProgress size={20} color="inherit" />
                }
              >
                Send
              </Button>
            </InputAdornment>
          ),
        }}
        onKeyDown={handleMessageSubmit}
      />
      <Typography color="error.main" variant="caption">
        {errors.message?.message}
      </Typography>
    </Box>
  );
};

export default MessageForm;
