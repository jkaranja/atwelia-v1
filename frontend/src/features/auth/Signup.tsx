import React, { useEffect, useState } from "react";

import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import FormGroup from "@mui/material/FormGroup";
import { Box } from "@mui/system";

import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Card, CardActions, CardContent, CardHeader } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { Link, useNavigate } from "react-router-dom";

import { Controller, SubmitHandler, useForm } from "react-hook-form";

import PhoneInput from "react-phone-input-2";
import useTitle from "../../hooks/useTitle";

import { toast } from "react-toastify";

import { PHONE_NUMBER_REGEX, PWD_REGEX } from "../../constants/regex";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { setCredentials } from "./authSlice";
import { useRegisterUserMutation } from "./userApiSlice";
import RegisterForm from "./RegisterForm";

export type TAuthInputs = {
  username: string;
  password: string;
  phoneNumber: string;
};

const Signup = () => {
  useTitle("Sign up for free");

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [checkPolicy, setCheckPolicy] = useState(true);

  const [showPassword, setShowPassword] = React.useState(false);

  const [pwdCaption, setPwdCaption] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
    watch,
    register,
  } = useForm<TAuthInputs>();

  const [registerUser, { data, error, isLoading, isError, isSuccess }] =
    useRegisterUserMutation();

  /**--------------------------------
   HANDLE SIGN UP SUBMIT
 -------------------------------------*/
  const onSubmit: SubmitHandler<TAuthInputs> = async (data) => {
    await registerUser(data);
  };

  //feedback
  useEffect(() => {
    if (isError) toast.error(error as string);

    if (isSuccess) toast.success("Account created!");

    const timeoutId = setTimeout(() => {
      //on success
      //on success & token is not null
      if (isSuccess && data?.accessToken) {
        //save token->store
        dispatch(setCredentials(data.accessToken));

        navigate("/listings");
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [isError, isSuccess, data]);

  return (
    <Box display="flex" justifyContent="center">
      <Card sx={{ pt: 4, px: 2, pb: 2, width: "450px" }} variant="outlined">
        <CardHeader
          title={
            <Typography variant="h4" gutterBottom>
              Create an account
            </Typography>
          }
          subheader={
            <Typography color="muted.dark">Please sign-up below</Typography>
          }
        />
        <CardContent>
          <RegisterForm
            handleSubmit={handleSubmit(onSubmit)}
            errors={errors}
            control={control}
            register={register}
            isLoading={isLoading}
          />
        </CardContent>
        <CardActions sx={{ justifyContent: "center" }}>
          <Typography variant="body2" color="muted.dark">
            Already have an account?{" "}
            <Typography
              variant="body2"
              component={Link}
              to="/login"
              color="primary.main"
            >
              Log in
            </Typography>
          </Typography>
        </CardActions>
      </Card>
    </Box>
  );
};

export default Signup;
