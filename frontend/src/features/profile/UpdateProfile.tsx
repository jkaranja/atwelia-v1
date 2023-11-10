import {
  Avatar,
  Button,
  FormLabel,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import FormGroup from "@mui/material/FormGroup";
import { Box } from "@mui/system";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { CircularProgress } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import { toast } from "react-toastify";
import Intro from "../../components/Intro";
import { PROFILE_PIC_ROOT } from "../../constants/paths";
import { PHONE_NUMBER_REGEX } from "../../constants/regex";
import { IProfile } from "../../types/user";
import { useUpdateProfileMutation } from "../auth/userApiSlice";

const MEGA_BYTES_PER_BYTE = 1e6;
const convertBytesToMB = (bytes: number) =>
  Math.round(bytes / MEGA_BYTES_PER_BYTE);

type UpdateProfileProps = {
  profile: IProfile;
  open: boolean;
  handleClose: () => void;
};

const UpdateProfile = ({ profile, open, handleClose }: UpdateProfileProps) => {
  const [updateProfile, { data, error, isLoading, isError, isSuccess }] =
    useUpdateProfileMutation();

  type Inputs = {
    files: FileList;
    bio: string;
    tourFee: number | string;
    phoneNumbers: { phone: string }[];
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, submitCount },
    reset: resetForm,
    control,
    watch,
    getValues,
    setValue,
  } = useForm<Inputs>({
    defaultValues: {
      // phoneNumbers: profile.phoneNumbers.map((phone) => ({ phone })),//this here phone: undefined//use resetForm
    },
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

  /**--------------------------------
   HANDLE SIGN UP SUBMIT
 -------------------------------------*/
  const onSubmit = async (data: Inputs) => {
    const formData = new FormData();

    formData.append("profilePic", data.files?.[0]);
    formData.append("bio", data.bio);
    formData.append("tourFee", String(data.tourFee));
    formData.append(
      "phoneNumbers",
      JSON.stringify(data.phoneNumbers.map((pNumber) => pNumber.phone))
    );

    await updateProfile(formData);
  };

  //set defaults
  useEffect(() => {
    resetForm({
      bio: profile?.bio || "",
      tourFee: profile?.tourFee || "",
      phoneNumbers: profile.phoneNumbers.map((phone) => ({ phone })),
    });
  }, [profile]);

  //feedback
  useEffect(() => {
    if (isError) toast.error(error as string);

    if (isSuccess) toast.success(data?.message);

    const timerId = setTimeout(() => {
      if (isSuccess) handleClose();
    }, 2000);

    return () => clearTimeout(timerId);
  }, [isError, isSuccess]);

  return (
    <Box>
      <Dialog
        fullWidth //works together with max width
        maxWidth="md" //default is small
        open={open}
        //onClose={handleClose}
      >
        <DialogTitle id="alert-dialog-title">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h5">Update profile</Typography>

            <IconButton size="large" color="default" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid2 container columnSpacing={2}>
              <Grid2 xs="auto">
                <Avatar
                  alt={profile.user?.username?.toUpperCase()}
                  src={
                    profilePic ||
                    `${PROFILE_PIC_ROOT}/${profile?.profilePic?.filename}`
                  }
                />
              </Grid2>
              <Grid2 xs>
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
                How much do you charge for a tour?
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
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 4 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={isLoading}
              endIcon={
                isLoading && <CircularProgress size={20} color="inherit" />
              }
            >
              Save changes
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default UpdateProfile;
