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

import usePersist from "../../hooks/usePersist";
import { Link } from "react-router-dom";
import { TAuthInputs } from "./Signup";

type SignInFormProps = {
  register: UseFormRegister<TAuthInputs>;
  errors: FieldErrors<TAuthInputs>;
  handleSubmit: () => Promise<void>;
  isLoading: boolean;
  control: Control<TAuthInputs>;
};

const SignInForm = ({
  handleSubmit,
  register,
  errors,
  isLoading,
  control,
}: SignInFormProps) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const [persist, setPersist] = usePersist();

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
          <Controller
            name="phoneNumber"
            control={control}
            rules={{
              validate: (value, formValues) =>
                PHONE_NUMBER_REGEX.test(value) ||
                "Invalid phone number. Format: +254xxxxxxxxx",
            }}
            render={({ field: { value, onChange, ...field } }) => (
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
                    country={"ke"} //initial country	'us' | 1
                    //onlyCountries={["ke"]} //country codes to be included	['cu','cw','kz']
                    // preferredCountries={["ke"]} //array	country codes to be at the top	['cu','cw','kz']
                    //excludeCountries	array	array of country codes to be excluded	['cu','cw','kz']

                    //placeholder//string	custom placeholder
                    //regions	array/string	to show countries only from specified regions//eg ['america', 'europe', 'asia', 'oceania', 'africa']
                    //localization={es}//import from same package//es Spanish, de Deutsch, ru//uses local language as specified
                    inputProps={{ required: true, autoFocus: true }} //	object	props to pass into the input eg  = {{ name: 'phone', required: true, autoFocus: true}}
                    value={value} //input state value
                    onChange={(phone) => onChange(`+${phone}`)} //onChange(value, country: { name, dialCode, countryCode (iso2) }, event, formattedValue)//value = phoneNumber without the '+'
                    //other events onFocus	onBlur	onClick	onKeyDown//Also receives (value, country, e, formattedValue)
                    // enableSearch
                    //autoFormat={false}	//true	on/off phone formatting
                    //disabled	false	disable input and dropdown
                    //disableDropdown	false	disable dropdown only
                    //disableCountryCode	false
                    //enableAreaCodes	false	enable local codes for all countries eg enableAreaCodes={['us', 'ca']}|| true
                    countryCodeEditable={false} //true //disable clearing code in input
                    //enableSearch	false	enable search in the dropdown
                    //disableSearchIcon	false	hide icon for the search field
                    //others:
                    //prefix//+,
                    //copyNumbersOnly //true//not sure//not adding the "+" if false
                    //autocompleteSearch	false
                    //showDropdown	false
                    //----styles//replace Style with class to pass a className
                    //buttonStyle	object	styles for dropdown button eg inputClass=""
                    inputStyle={{ height: 55, width: "100%" }} //	object	styles for input
                    containerStyle={{ height: 55 }} //object	styles for container
                    //searchStyle
                    //dropdownStyle
                    //validation
                    // isValid={(inputNumber, country, countries) => {
                    //   return countries.some((country) => {
                    //     return (
                    //       startsWith(inputNumber, country.dialCode) ||
                    //       startsWith(country.dialCode, inputNumber)
                    //     );
                    //   });
                    // }}
                  />
                )}
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
          />
          <Typography color="error.main" variant="caption">
            {errors.password?.message}
          </Typography>
        </FormGroup>

        <Box
          py={2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <FormGroup sx={{ fontSize: "12px" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={persist}
                  onChange={() => setPersist(!persist)}
                />
              }
              label={
                <Typography variant="body2" color="muted.dark">
                  Remember Me
                </Typography>
              }
            />
          </FormGroup>

          <Typography
            variant="body2"
            component={Link}
            to="/forgot"
            color="primary.main"
          >
            Forgot Password?
          </Typography>
        </Box>

        <Button
          type="submit"
          size="large"
          variant="contained"
          fullWidth
          disabled={isLoading}
          endIcon={isLoading && <CircularProgress size={20} color="inherit" />}
        >
          Sign in
        </Button>
      </form>
    </Box>
  );
};

export default SignInForm;
