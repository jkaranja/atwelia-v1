import { Avatar, Button, TextField, Typography, Paper } from "@mui/material";
import FormGroup from "@mui/material/FormGroup";
import { Box } from "@mui/system";

import { CircularProgress } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { toast } from "react-toastify";

import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm, useWatch } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import { PROFILE_PIC_ROOT } from "../../constants/paths";
import { EMAIL_REGEX, PHONE_NUMBER_REGEX } from "../../constants/regex";
import { IUser } from "../../types/user";
import { useUpdateUserMutation } from "../auth/userApiSlice";
import ConfirmPwd from "./ConfirmPwd";

export type AccountInputs = {
  username: string;
  email: string;
  phoneNumber: string;
  password: string;
  newPassword: string;
  confirmPassword: string;
};

type AccountProps = {
  user: IUser;
};
const Account = ({ user }: AccountProps) => {
  const [updateUser, { data, error, isLoading, isError, isSuccess }] =
    useUpdateUserMutation();

  //dialogs
  const [openPwdD, setOpenPwdD] = useState(false);
  const handleTogglePwdD = () => setOpenPwdD((prev) => !prev);

  //r-hook-from
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, submitCount },
    reset: resetForm,
    control,
    watch,
    getValues,
    setValue,
  } = useForm<AccountInputs>();

  const onSubmit: SubmitHandler<AccountInputs> = async (data) => {
    await updateUser({
      username: data.username,
      phoneNumber: data.phoneNumber,
      email: data.email,
      password: data.password,
    });
  };
  //set defaults
  useEffect(() => {
    resetForm({
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
    });
  }, [user]);

  //close pass dialog if account inputs error
  useEffect(() => {
    if (errors.username || errors.phoneNumber || errors.email) {
      setOpenPwdD(false);
    }
  }, [Object.keys(errors).length, submitCount]); //note: passing errors won;t work => errors holds a reference to errors object/won't change

  //feedback
  useEffect(() => {
    if (isError) toast.error(error as string);

    if (isSuccess) toast.success(data?.message);

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
        <Typography variant="h6" paragraph gutterBottom>
          Account details
        </Typography>

        <FormGroup sx={{ mb: 2 }}>
          <TextField
            {...register("username", {
              required: "Username is required",
            })}
            InputLabelProps={{
              shrink: true,
            }}
            label="Username"
            margin="dense"
          />
          <Typography color="error.main" variant="caption">
            {errors.username?.message}
          </Typography>
        </FormGroup>

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

        <FormGroup sx={{ mb: 3 }}>
          <TextField
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: EMAIL_REGEX,
                message: "Enter an email address",
              },
            })}
            InputLabelProps={{
              shrink: true,
            }}
            label="Email"
            margin="dense"
          />
          <Typography color="error.main" variant="caption">
            {errors.email?.message}
          </Typography>
        </FormGroup>

        <Button
          variant="contained"
          disabled={isLoading}
          endIcon={isLoading && <CircularProgress size={20} color="inherit" />}
          onClick={handleTogglePwdD}
        >
          Save changes
        </Button>
      </Box>
    </Box>
  );
};

export default Account;
