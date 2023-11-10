import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Card,
  CardActionArea,
  CardHeader,
  CircularProgress,
  Collapse,
  DialogContentText,
  FormGroup,
  Grow,
  IconButton,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import React, { useEffect, useState } from "react";

import { addDays, addHours, startOfDay } from "date-fns";

import PhoneInput from "react-phone-input-2";

import { Controller, SubmitHandler, useForm } from "react-hook-form";

import { toast } from "react-toastify";
import { useRegisterUserMutation } from "./userApiSlice";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import TabPanel from "../../components/TabPanel";
import RegisterForm from "./RegisterForm";
import SignInForm from "./SignInForm";
import { useLoginMutation } from "./authApiSlice";
import { setCredentials } from "./authSlice";
import MyTab from "../../components/MyTab";
import { TAuthInputs } from "./Signup";

type AuthDialogProps = {
  open: boolean;
  handleClose: () => void;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
};

const AuthDialog = ({
  open,
  handleClose,
  setIsAuthenticated,
}: AuthDialogProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [tabValue, setTabValue] = useState<string>("signin");

  const handleTabChange = (event: React.SyntheticEvent, tabValue: string) => {
    setTabValue(tabValue);
  };

  const [
    login,
    {
      data: loginData,
      error: loginError,
      isLoading: isLoggingIn,
      isError: isLoginError,
      isSuccess: isLoggedInSuccess,
    },
  ] = useLoginMutation();

  const [registerUser, { data, error, isLoading, isError, isSuccess }] =
    useRegisterUserMutation();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitted },
    watch,
    register,
  } = useForm<TAuthInputs>();

  /**--------------------------------
   HANDLE SIGN UP SUBMIT
 -------------------------------------*/
  const onRegisterSubmit: SubmitHandler<TAuthInputs> = async (data) => {
    await registerUser(data);
  };

  /**--------------------------------
   HANDLE LOGIN SUBMIT
 -------------------------------------*/
  const onLoginSubmit: SubmitHandler<Omit<TAuthInputs, "username">> = async (
    data
  ) => {
    await login({ phoneNumber: data.phoneNumber, password: data.password });
  };

  //feedback
  useEffect(() => {
    if (isError || isLoginError) toast.error((error || loginError) as string);

    if (isSuccess && data?.accessToken) {
      dispatch(setCredentials(data.accessToken));
      setIsAuthenticated(true);
    }

    if (isLoggedInSuccess && loginData?.accessToken) {
      dispatch(setCredentials(loginData.accessToken));
      setIsAuthenticated(true);
    }
  }, [isError, isSuccess, isLoginError, isLoggedInSuccess]);

  return (
    <Dialog
      fullWidth //works together with max width
      maxWidth="sm" //default is small
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" sx={{ pb: 0 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" gutterBottom>
            Sign in or create account to continue
          </Typography>

          <IconButton size="large" color="default" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ minHeight: "20vh", py: 0 }}>
        <DialogContentText sx={{ mb: 2 }}>
          Please sign in or create account below
        </DialogContentText>

        <Box sx={{ borderBottom: 1, borderColor: "dull.light" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="basic tabs example"
            textColor="primary"
            indicatorColor="primary"
            variant="scrollable"
          >
            <MyTab
              //   icon={<PersonOutlineOutlinedIcon />}
              //   iconPosition="start"
              label={
                <Box sx={{ display: "flex" }}>
                  <Typography pl={1}> Sign in</Typography>
                </Box>
              }
              value="signin"
            />

            <MyTab
              label={
                <Box sx={{ display: "flex" }}>
                  <Typography pl={1}>Create account</Typography>
                </Box>
              }
              value="register"
            />
          </Tabs>
        </Box>

        <Box>
          <TabPanel value={tabValue} index="signin">
            <SignInForm
              handleSubmit={handleSubmit(onLoginSubmit)}
              errors={errors}
              control={control}
              register={register}
              isLoading={isLoggingIn}
            />
          </TabPanel>

          <TabPanel value={tabValue} index="register">
            <RegisterForm
              handleSubmit={handleSubmit(onRegisterSubmit)}
              errors={errors}
              control={control}
              register={register}
              isLoading={isLoading}
            />
          </TabPanel>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 4 }}></DialogActions>
    </Dialog>
  );
};

export default AuthDialog;
