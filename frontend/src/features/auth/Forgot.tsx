import { useEffect } from "react";

import {
  Button,
  CircularProgress,
  TextField,
  Typography,
  FormLabel,
} from "@mui/material";
import FormGroup from "@mui/material/FormGroup";
import { Box } from "@mui/system";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

import { Card, CardActions, CardContent, CardHeader } from "@mui/material";
import { Link } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import { Controller, useForm } from "react-hook-form";

import useTitle from "../../hooks/useTitle";

import { toast } from "react-toastify";
import { EMAIL_REGEX, PHONE_NUMBER_REGEX } from "../../constants/regex";
import { useForgotPwdMutation } from "./authApiSlice";

const Forgot = () => {
  useTitle("Forgot password");

  const [forgotPwd, { data, error, isLoading, isError, isSuccess }] =
    useForgotPwdMutation();

  type ForgotInputs = {
    email: string;
    phoneNumber: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ForgotInputs>();

  const onSubmit = async (inputs: ForgotInputs) => {
    await forgotPwd(inputs);
  };

  //feedback
  useEffect(() => {
    if (isError) toast.error(error as string);

    if (isSuccess) toast.success(data?.message);

    return () => toast.dismiss();
  }, [isError, isSuccess]);

  return (
    <Box sx={{ display: "flex" }} justifyContent="center">
      <Card sx={{ pt: 4, px: 2, pb: 2, maxWidth: "450px" }}>
        <CardHeader
          title={
            <Typography variant="h4" gutterBottom>
              Forgot Password?
            </Typography>
          }
          subheader={
            <Typography color="muted.dark">
              Enter your account phone number and we′ll send you a link the
              provided email to reset your password
            </Typography>
          }
        />
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup sx={{ mb: 2 }}>
              <Controller
                name="phoneNumber"
                control={control}
                rules={{
                  validate: (value, formValues) =>
                    PHONE_NUMBER_REGEX.test(value) ||
                    "Invalid phone number. Format: +254xxxxxxxxx",
                }}
                render={({ field: { value, onChange, ...field } }) => (
                  <PhoneInput
                    country={"ke"}
                    onlyCountries={["ke"]}
                    // inputProps={{ required: true, autoFocus: true }} //	object	props to pass into the input eg  = {{ name: 'phone', required: true, autoFocus: true}}
                    value={value} //input state value
                    onChange={(phone) => onChange(`+${phone}`)} //onChange(value, country: { name, dialCode, countryCode (iso2) }, event, formattedValue)//value = phoneNumber without the '+'
                    countryCodeEditable={false}
                    inputStyle={{ height: 55, width: "100%" }}
                    containerStyle={{ height: 55 }}
                  />
                )}
              />
              <Typography color="error.main" variant="caption">
                {errors.phoneNumber?.message}
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
                color="primary"
              />
              <Typography color="error.main" variant="caption">
                {errors.email?.message}
              </Typography>
            </FormGroup>

            <Button
              type="submit"
              size="large"
              sx={{ mt: 2 }}
              variant="contained"
              fullWidth
              color="primary"
              disabled={isLoading}
              endIcon={
                isLoading && <CircularProgress size={20} color="inherit" />
              }
            >
              Send reset link
            </Button>
          </form>
        </CardContent>
        <CardActions sx={{ display: "block", textAlign: "center" }}>
          <Button
            component={Link}
            to="/login"
            color="primary"
            startIcon={<ChevronLeftIcon color="primary" fontSize="small" />}
            sx={{ textTransform: "none" }}
          >
            Back to login
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default Forgot;
