import { Button, InputAdornment, TextField, Typography } from "@mui/material";
import FormGroup from "@mui/material/FormGroup";
import { Box } from "@mui/system";

import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { toast } from "react-toastify";

import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import { PHONE_NUMBER_REGEX } from "../../constants/regex";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import usePersist from "../../hooks/usePersist";
import useTitle from "../../hooks/useTitle";
import { useLoginMutation } from "./authApiSlice";
import { setCredentials } from "./authSlice";
import SignInForm from "./SignInForm";
import { TAuthInputs } from "./Signup";



const Login = () => {
  useTitle("Sign in");
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const from = location.state?.from?.pathname || "/tours";

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
    watch,
    register,
  } = useForm<TAuthInputs>();

  const [login, { data, error, isLoading, isError, isSuccess }] =
    useLoginMutation();

  /**--------------------------------
   HANDLE SIGN UP SUBMIT
 -------------------------------------*/
  const onSubmit: SubmitHandler<Omit<TAuthInputs, "username">> = async (data) => {
    await login(data);
  };

  //send otp feedback
  useEffect(() => {
    if (isError) toast.error(error as string);

    //on success & token is not null
    if (isSuccess && data?.accessToken) {
      //save token->store
      dispatch(setCredentials(data.accessToken));

      //use 'from' when dealing with one user like from || '/user path'
      //replace->replaces history stack with prev path/i.e skips adding this login path to history//
      //after you navigate to path below and you hit back in browser, you won't go back to login page but to the path you were b4 navigating to /login
      navigate(from, { replace: true });
    }

    return () => toast.dismiss();
  }, [isSuccess, isError]);

  return (
    <Box sx={{ display: "flex" }} justifyContent="center">
      <Card sx={{ pt: 4, px: 2, pb: 5, width: "450px" }} variant="outlined">
        <CardHeader
          title={
            <Typography variant="h4" gutterBottom>
              Welcome back
            </Typography>
          }
          subheader={
            <Typography color="muted.dark">
              Please sign-in to your account below
            </Typography>
          }
        />
        <CardContent>
          <SignInForm
            handleSubmit={handleSubmit(onSubmit)}
            errors={errors}
            control={control}
            register={register}
            isLoading={isLoading}
          />
        </CardContent>
        <CardActions sx={{ justifyContent: "center" }}>
          <Typography color="muted.dark" variant="body2">
            Don't have an account?{" "}
            <Typography
              variant="body2"
              component={Link}
              to="/signup"
              color="primary.main"
            >
              Sign up
            </Typography>
          </Typography>
        </CardActions>
      </Card>
    </Box>
  );
};

export default Login;
