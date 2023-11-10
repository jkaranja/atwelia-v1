import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Button,
  CircularProgress,
  FormGroup,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { toast } from "react-toastify";

import { AccountInputs } from "./Account";
import ConfirmPwd from "./ConfirmPwd";
import { IUser } from "../../types/user";
import { useUpdateUserMutation } from "../auth/userApiSlice";
import { PWD_REGEX } from "../../constants/regex";

type SecurityProps = {
  user: IUser;
};

const Security = ({ user }: SecurityProps) => {
  const [pwdCaption, setPwdCaption] = useState(false);

  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPass, setShowConfirmPass] = React.useState(false);
  //new pwd handler
  const handleClickShowNewPassword = () => setShowNewPassword((show) => !show);
  const handleMouseDownNewPassword: React.MouseEventHandler<
    HTMLButtonElement
  > = (event) => {
    event.preventDefault();
  };

  //confirm password handler
  const handleConfirmShowPass = () => setShowConfirmPass((show) => !show);
  const handleMouseDownConfirmPass: React.MouseEventHandler<
    HTMLButtonElement
  > = (event) => {
    event.preventDefault();
  };

  //dialogs
  const [openPwdD, setOpenPwdD] = useState(false);
  const handleTogglePwdD = () => setOpenPwdD((prev) => !prev);

  //pwd hook
  const {
    register: register,
    handleSubmit: handleSubmit,
    formState: { errors, isValid, submitCount },
    watch,
    reset: resetForm,
  } = useForm<AccountInputs>();

  const [updateUser, { data, error, isLoading, isError, isSuccess }] =
    useUpdateUserMutation();
  /**--------------------------------
   HANDLE PWD SUBMIT
 -------------------------------------*/
  const onSubmit: SubmitHandler<AccountInputs> = async (data) => {
    await updateUser({
      newPassword: data.newPassword,
      password: data.password,
    });
  };

  //close pass dialog if account inputs error
  useEffect(() => {
    if (errors.newPassword || errors.confirmPassword) {
      setOpenPwdD(false);
    }
  }, [Object.keys(errors).length, submitCount]); //1st submit try errors change coz mode= onSubmit//close d if err//2nd try if same err, errors does change, dialog not closed=> use submitCount/(can be enough alone) 

  //feedback
  useEffect(() => {
    if (isSuccess) {
      resetForm({ newPassword: "", confirmPassword: "" });
    }

    if (isError) toast.error(error as string);

    if (isSuccess) toast.success("Updated");

    if (isSuccess) setOpenPwdD(false);

    return () => toast.dismiss();
  }, [isError, isSuccess]);

  return (
    <Box component={Paper} p={3}>
      {openPwdD && (
        <ConfirmPwd
          errors={errors}
          register={register}
          isLoading={isLoading}
          handleSubmit={handleSubmit(onSubmit)} //pass the cb returned by handleSubmit(arg)
          open={openPwdD}
          handleClose={handleTogglePwdD}
        />
      )}
      <Box sx={{ maxWidth: { lg: "40vw" } }}>
        <Typography variant="h6" gutterBottom mb={3}>
          Change Password
        </Typography>

        {/* ----------new pass------------ */}
        <FormGroup sx={{ mb: 0.5 }}>
          <TextField
            {...register("newPassword", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Enter at least 6 characters",
              },
              pattern: {
                value: PWD_REGEX,
                message: "Spaces not allowed",
              },
            })}
            color="secondary"
            margin="dense"
            label="Password"
            type={showNewPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowNewPassword}
                    onMouseDown={handleMouseDownNewPassword}
                    edge="end"
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            onFocus={() => setPwdCaption(true)}
          />
          <Typography color="error.main" variant="caption">
            {errors.newPassword?.message}
          </Typography>
          {pwdCaption && (
            <Typography variant="caption" color="muted.main" gutterBottom>
              At least 6 characters with no spaces
            </Typography>
          )}
        </FormGroup>
        {/* ----------confirm pass------------ */}
        <FormGroup sx={{ mb: 2 }}>
          <TextField
            {...register("confirmPassword", {
              required: "Password is required",
              validate: (value, formValues) =>
                formValues.newPassword === value || "Passwords don't match",
            })}
            color="secondary"
            margin="dense"
            label="Confirm Password"
            type={showConfirmPass ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleConfirmShowPass}
                    onMouseDown={handleMouseDownConfirmPass}
                    edge="end"
                  >
                    {showConfirmPass ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Typography color="error.main" variant="caption">
            {errors.confirmPassword?.message}
          </Typography>
        </FormGroup>
        <Button
          variant="contained"
          disabled={isLoading}
          endIcon={isLoading && <CircularProgress size={20} color="inherit" />}
          onClick={handleTogglePwdD}
        >
          Change password
        </Button>
      </Box>
    </Box>
  );
};

export default Security;
