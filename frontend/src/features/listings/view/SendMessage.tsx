import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  CircularProgress,
  FormGroup,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { IListing } from "../../../types/listing";
import AuthDialog from "../../auth/AuthDialog";
import { selectCurrentToken } from "../../auth/authSlice";
import { usePostMessageMutation } from "../../chat/chatApiSlice";

type SendMessageProps = {
  open: boolean;
  handleClose: () => void;
  listing: IListing;
};

const SendMessage = ({ open, handleClose, listing }: SendMessageProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();

  const token = useAppSelector(selectCurrentToken);

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  //dialogs
  const [openAuthD, setOpenAuthD] = useState(false);
  const handleToggleAuthD = () => setOpenAuthD((prev) => !prev);

  const [postMessage, { isLoading, isSuccess, isError, error, data }] =
    usePostMessageMutation();

  type Inputs = {
    message: string;
  };
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, submitCount },
    reset: resetForm,
    control,
    watch,
    getValues,
    setValue,
  } = useForm<Inputs>();

  const onSubmit = async (data: Inputs) => {
    const formData = new FormData();
    formData.append("content", data.message);
    formData.append("recipient", listing.user._id!);
    await postMessage(formData);
  };

  //auth & retry
  useEffect(() => {
    if (token && isAuthenticated) {
      handleToggleAuthD();
      handleSubmit(onSubmit)();
    }
  }, [token, isAuthenticated]);

  //feedback
  useEffect(() => {
    if (isError) toast.error(error as string);

    if (isSuccess) toast.success("Message sent");

    const timerId = setTimeout(() => {
      if (isSuccess) handleClose();
    }, 2000);

    return () => clearTimeout(timerId);
  }, [isError, isSuccess]);

  return (
    <Box>
      {openAuthD && (
        <AuthDialog
          open={openAuthD}
          handleClose={handleToggleAuthD}
          setIsAuthenticated={setIsAuthenticated}
        />
      )}

      <Dialog
        fullWidth //works together with max width
        maxWidth="sm" //default is small
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

        <form>
          <DialogContent sx={{ py: 0 }}>
            <DialogContentText id="alert-dialog-description"></DialogContentText>

            <Typography variant="h5" gutterBottom>
              Fill the form below to contact agent
            </Typography>
            <Typography paragraph>
              Get in touch with this agent by submitting the form below. To view
              their replies, go to 'manage listings {">"} messages'
            </Typography>

            <FormGroup sx={{ mb: 2 }}>
              <TextField
                {...register("message", {
                  required: "Message is required",
                })}
                label="Message"
                margin="dense"
                rows={4}
                multiline
              />
              <Typography color="error.main" variant="caption">
                {errors.message?.message}
              </Typography>
            </FormGroup>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 4 }}>
            <Button
              onClick={!token ? handleToggleAuthD : handleSubmit(onSubmit)}
              variant="contained"
              disabled={isLoading}
              endIcon={
                isLoading && <CircularProgress size={20} color="inherit" />
              }
            >
              Send Message
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default SendMessage;
