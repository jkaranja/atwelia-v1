import {
  Avatar,
  Button,
  FormLabel,
  InputAdornment,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import FormGroup from "@mui/material/FormGroup";
import { Box } from "@mui/system";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { CircularProgress } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { toast } from "react-toastify";

import { useEffect } from "react";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import Intro from "../../components/Intro";
import { PHONE_NUMBER_REGEX } from "../../constants/regex";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { Role } from "../../types/user";
import { useRefreshMutation } from "../auth/authApiSlice";
import { setRole } from "../auth/authSlice";
import { useCreateProfileMutation } from "../auth/userApiSlice";

export type ProfileFormInputs = {
  files: FileList;
  bio: string;
  tourFee: number | string;
  phoneNumbers: { phone: string }[];
};

const MEGA_BYTES_PER_BYTE = 1e6;
const convertBytesToMB = (bytes: number) =>
  Math.round(bytes / MEGA_BYTES_PER_BYTE);

type ProfileFormProps = {
  handleNext: () => void;
  handleBack: () => void;
};

const ProfileForm = ({ handleNext, handleBack }: ProfileFormProps) => {
  const dispatch = useAppDispatch();

  const [createProfile, { data, error, isLoading, isError, isSuccess }] =
    useCreateProfileMutation();

  const [refresh, { isLoading: isTokenLoading, isSuccess: isTokenSuccess }] =
    useRefreshMutation();

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
  } = useForm<ProfileFormInputs>({
    defaultValues: { phoneNumbers: [{ phone: "" }, { phone: "" }] },
  });

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "phoneNumbers", // unique name for your Field Array
    }
  );

  const profilePic =
    watch("files")?.length && URL.createObjectURL(watch("files")[0]);

  const handlePicReset = () => {
    resetForm({ files: [] as unknown as FileList });
  };

  const onSubmit: SubmitHandler<ProfileFormInputs> = async (data) => {
    const formData = new FormData();
    //profile data
    formData.append("profilePic", data.files?.[0]);

    formData.append("bio", data.bio);
    formData.append("tourFee", String(data.tourFee));
    formData.append(
      "phoneNumbers",
      JSON.stringify(data.phoneNumbers.map((pNumber) => pNumber.phone))
    );

    await createProfile(formData);
  };

  //feedback
  useEffect(() => {
    if (isError) toast.error(error as string);

    if (isSuccess) toast.success(data?.message);

    if (isSuccess) {
      //refresh token to refetch & store a new token with now accountStatus-> approved
      (async () => {
        await refresh();

        //then go to next
        handleNext();
      })();
    }
  }, [isError, isSuccess]);

  return (
    <Box>
      <Intro pb={4}>Fill the form below to create a profile</Intro>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid2 container>
          <Grid2>
            <Avatar alt="Profile" src={profilePic || "/"} />
          </Grid2>
          <Grid2>
            <Typography variant="h6" gutterBottom>
              <Button
                color="inherit"
                variant="outlined"
                sx={{ mx: { md: 2 } }}
                component="label"
              >
                <input
                  {...register("files", {
                    // required: "Recipe",
                    validate: (value) => {
                      return true;
                      // const fileType = ["image/jpeg", "image/png", "image/gif"];
                      // if (convertBytesToMB(value?.[0]?.size || 0) > 5)
                      //   return "File must be less than or equal to 5mb in size";
                    },
                  })}
                  type="file"
                  hidden
                  accept="image/*"
                />
                Upload new photo
              </Button>
              <Button color="secondary" onClick={handlePicReset}>
                Reset
              </Button>
            </Typography>
            <Typography variant="caption" gutterBottom>
              Recommended dimensions: 200x200, maximum file size: 5MB
            </Typography>
            <Typography color="error.main" variant="caption" paragraph>
              {errors.files?.message}
            </Typography>
          </Grid2>
        </Grid2>

        <FormGroup sx={{ my: 2 }}>
          <FormLabel>
            Write a brief introduction about yourself
            <Typography pl={0.5} color="muted.main" component="span">
              *
            </Typography>
          </FormLabel>
          <TextField
            {...register("bio", {
              required: "Bio is required",
              // maxLength: {
              //   value: 60,
              //   message: "Exceeded ",
              // },
            })}
            //label=""
            margin="dense"
            rows={4}
            multiline
            // placeholder="Example: "
          />
          <Typography color="error.main" variant="caption">
            {errors.bio?.message}
          </Typography>
        </FormGroup>

        <FormGroup sx={{ mb: 2 }}>
          <FormLabel>
            How much will you charge for a tour?
            <Typography pl={0.5} color="muted.main" component="span">
              *
            </Typography>
          </FormLabel>
          <TextField
            {...register("tourFee", {
              required: "Tour fee is required",
            })}
            type="number"
            margin="dense"
            //size="small"
            // color="secondary"
            fullWidth
            //placeholder="0"
            //label=""
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">Ksh</InputAdornment>
              ),
            }}
          />
          <Typography color="error.main" variant="caption">
            {errors.tourFee?.message}
          </Typography>
        </FormGroup>

        <FormGroup>
          <FormLabel>
            Add contacts{" "}
            <Typography
              pl={0.5}
              variant="caption"
              color="muted.main"
              component="span"
            >
              (Phone numbers clients can use to reach you)
            </Typography>
            *
          </FormLabel>
          <Box textAlign="right" pb={2} pt={1}>
            <Button
              startIcon={<AddIcon />}
              onClick={() => append({ phone: "" })}
              variant="outlined"
              size="small"
            >
              Add
            </Button>
          </Box>

          {fields.map((item, index) => (
            <Box
              key={item.id} // important to include key with field's id
              display="flex"
              columnGap={2}
              alignItems="flex-start"
              mb={1}
            >
              <Typography variant="body2">Phone {index + 1}</Typography>
              <Box flexGrow={1}>
                <Controller
                  name={`phoneNumbers.${index}.phone` as const} //{...register(`test.${index}.firstName` as const)}
                  control={control}
                  rules={{
                    validate: (value, formValues) =>
                      PHONE_NUMBER_REGEX.test(value) ||
                      "Invalid. Format: +254xxxxxxxxx",
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
                  {errors.phoneNumbers?.[index]?.phone?.message}
                </Typography>
              </Box>
              <Button
                startIcon={<RemoveIcon />}
                onClick={() => remove(index)}
                variant="outlined"
                size="small"
                color="error"
                disabled={index === 0}
              >
                Remove
              </Button>
            </Box>
          ))}
        </FormGroup>

        <Box py={6} display="flex" justifyContent="space-between">
          <Button variant="outlined" color="inherit" onClick={handleBack}>
            Back
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={isLoading || isTokenLoading}
            endIcon={
              (isLoading || isTokenLoading) && (
                <CircularProgress size={20} color="inherit" />
              )
            }
          >
            Create profile
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default ProfileForm;
