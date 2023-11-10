import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import FormGroup from "@mui/material/FormGroup";
import { Box } from "@mui/system";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { EMAIL_REGEX } from "../constants/regex";
import useTitle from "../hooks/useTitle";
import { usePostMessageMutation } from "./pagesApiSlice";

const Deletion = () => {
  useTitle("Delete or deactivate account");

  const [postMessage, { data, error, isLoading, isError, isSuccess }] =
    usePostMessageMutation();

  type ForgotInputs = {
    name: string;
    message: string;
    email: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotInputs>();

  const onSubmit = async (inputs: ForgotInputs) => {
    await postMessage({
      data: inputs,
    });
  };

  //feedback
  useEffect(() => {
    if (isError) toast.error(error as string);

    if (isSuccess) toast.success(data?.message);

    return () => toast.dismiss();
  }, [isError, isSuccess]);

  return (
    <Box sx={{ display: "flex" }} justifyContent="center">
      <Card sx={{ pt: 4, px: 2, pb: 2, maxWidth: "500px" }}>
        <CardHeader
          title={
            <Typography variant="h4" gutterBottom>
              Request for account and data deletion (Atwelia App)
            </Typography>
          }
          subheader={
            <Typography color="muted.dark">
              If you would wish to have your account and all data associated to
              it deleted, please fill the request form below.
            </Typography>
          }
        />
        <CardContent>
          <Typography color="muted.dark" gutterBottom paragraph>
            Please note that, all your data (account and security details,
            listings, messages, and any other collected data) will be deleted
            permanently from our platform. We don't retain any user data and
            hence this operation is irreversible.
          </Typography>

          <Typography color="muted.dark" gutterBottom paragraph>
            After receiving your request, we will send you an email to confirm
            your request and upon confirmation, all your data and account will
            be deleted right away.
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup sx={{ mb: 2 }}>
              <TextField
                {...register("name", {
                  required: "Name is required",
                })}
                id="outlined-basic"
                label="Name"
              />
              <Typography color="error.main" variant="caption">
                {errors.name?.message}
              </Typography>
            </FormGroup>

            <FormGroup sx={{ mb: 2 }}>
              <TextField
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: EMAIL_REGEX,
                    message: "Enter an email address",
                  },
                })}
                id="outlined-basic"
                label="Email"
              />
              <Typography color="error.main" variant="caption">
                {errors.email?.message}
              </Typography>
            </FormGroup>

            <FormGroup sx={{ mb: 2 }}>
              <TextField
                {...register("message", {
                  //required: "Message required",
                })}
                label="Message"
                margin="dense"
                multiline
                minRows={4}
                maxRows={8}
                fullWidth
              />
              <Typography color="error.main" variant="caption">
                {errors.message?.message}
              </Typography>
            </FormGroup>

            <Button
              type="submit"
              size="large"
              sx={{ mt: 2 }}
              variant="contained"
              fullWidth
              disabled={isLoading}
              endIcon={
                isLoading && <CircularProgress size={20} color="inherit" />
              }
            >
              Submit request
            </Button>
          </form>
        </CardContent>
        <CardActions sx={{ display: "block", textAlign: "center" }}>
          <Button
            component={Link}
            to="/login"
            startIcon={<ChevronLeftIcon fontSize="small" />}
            sx={{ textTransform: "none" }}
          >
            login
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default Deletion;
