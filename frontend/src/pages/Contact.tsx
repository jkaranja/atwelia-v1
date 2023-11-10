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

const Contact = () => {
  useTitle("Contact");

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
              Contact us
            </Typography>
          }
          subheader={
            <Typography color="muted.dark">
              Use the form below or send us an email at support@atwelia.com. You
              can also talk to us on WhatsApp: +254799295587.
            </Typography>
          }
        />
        <CardContent>
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
              Send
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

export default Contact;
