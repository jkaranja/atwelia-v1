import React, { useState } from "react";

import { Button, CircularProgress, TextField, Typography } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import { Box } from "@mui/system";
import PhoneInput from "react-phone-input-2";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import { PHONE_NUMBER_REGEX, PWD_REGEX } from "../../constants/regex";
import { TAuthInputs } from "./Signup";

type RegisterFormProps = {
  register: UseFormRegister<TAuthInputs>;
  errors: FieldErrors<TAuthInputs>;
  handleSubmit: () => Promise<void>;
  isLoading: boolean;
  control: Control<TAuthInputs>;
};

const RegisterForm = ({
  handleSubmit,
  register,
  errors,
  isLoading,
  control,
}: RegisterFormProps) => {
  const [checkPolicy, setCheckPolicy] = useState(true);

  const [showPassword, setShowPassword] = React.useState(false);

  const [pwdCaption, setPwdCaption] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <FormGroup sx={{ mb: 2 }}>
          <TextField
            {...register("username", {
              required: "Username is required",
            })}
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
            // rules={{
            //   validate: (value, formValues) =>
            //     PHONE_NUMBER_REGEX.test(value) ||
            //     "Invalid phone number. Format: +254xxxxxxxxx",
            // }}
            render={({ field: { value, onChange, ...field } }) => (
              <PhoneInput
                country={"ke"}
                // onlyCountries={["ke"]}
                inputProps={{ required: true, autoFocus: true }} //	object	props to pass into the input eg  = {{ name: 'phone', required: true, autoFocus: true}}
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

        {/* ----------pass------------ */}
        <FormGroup sx={{ mb: 0.5 }}>
          <TextField
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Enter at least 6 characters",
              },
              pattern: {
                value: PWD_REGEX,
                message: "Spaces not allowed",
              },
              //option2://value only eg pattern: 'regex', required: true, //then use errors.password && <span>..err</span>
            })}
            color="primary"
            fullWidth
            margin="dense"
            label="Password"
            type={showPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            onFocus={() => setPwdCaption(true)}
          />
          <Typography color="error.main" variant="caption">
            {errors.password?.message}
          </Typography>
          {pwdCaption && (
            <Typography variant="caption" color="muted.dark">
              At least 6 characters with no spaces
            </Typography>
          )}
        </FormGroup>

        <FormGroup sx={{ fontSize: "12px" }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={checkPolicy}
                onChange={() => setCheckPolicy(!checkPolicy)}
              />
            }
            label={
              <Typography variant="body2" color="muted.dark">
                I agree to privacy policy & terms
              </Typography>
            }
          />
        </FormGroup>

        <Button
          type="submit"
          size="large"
          sx={{ mt: 2 }}
          variant="contained"
          fullWidth
          disabled={!checkPolicy || isLoading}
          endIcon={isLoading && <CircularProgress size={20} color="inherit" />}
        >
          Sign up
        </Button>
      </form>
    </Box>
  );
};

export default RegisterForm;
