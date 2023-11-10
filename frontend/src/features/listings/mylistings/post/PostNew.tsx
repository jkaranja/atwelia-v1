import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  DialogContentText,
  IconButton,
  Step,
  StepLabel,
  Stepper,
  Typography,
  CircularProgress,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAppDispatch } from "../../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../../hooks/useAppSelector";

import { resetDraft, selectDraftListing } from "../listingSlice";

import Intro from "../../../../components/Intro";
import { usePostNewListingMutation } from "../listingApiSlice";

import { ListingStatus } from "../../../../types/listing";
import compressImage from "../../../../utils/compressImage";
import FactsForm from "./FactsForm";
import GeneralForm from "./GeneralForm";

type PostNewProps = {
  open: boolean;
  handleClose: () => void;
};

const PostNew = ({ open, handleClose }: PostNewProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const draft = useAppSelector(selectDraftListing);

  const [status, setStatus] = useState<ListingStatus>(ListingStatus.Available);

  const [postNewListing, { data, error, isLoading, isError, isSuccess }] =
    usePostNewListingMutation();

  const steps = [
    {
      label: "Facts & features",
      altLabel: "Facts and features",
      content: <FactsForm />,
    },

    {
      label: "Photos",
      altLabel: "Wrap things up ",
      content: <GeneralForm />,
    },
  ];

  const maxSteps = steps.length;
  //handle next btn
  const handleNext = () => {
    //check required fields//index/step 0
    if (activeStep === 0) {
      const isValid =
        draft.location && draft.bathrooms && draft.bedrooms && draft.price;

      if (!isValid) {
        return toast.error("Fields with '*' are required");
      }
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  //handle back btn
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  //handle reset
  const handleReset = () => {
    dispatch(resetDraft());
    setActiveStep(0);
  };

  //submit data
  const saveListing = async (status: ListingStatus) => {
    //status for controlling loading btn state
    setStatus(status);

    //check photos-> at least 3
    if ((draft.listingImages?.length || 0) < 3) {
      return toast.error("Please add at least 3 photos");
    }

    const formData = new FormData();

    //append listing images
    draft.listingImages?.forEach((img) => {
      formData.append("files", img as unknown as File); //if value is not a string | Blob/File, it will be converted to string
    });

    //append the rest
    Object.keys(draft).forEach((field, i) => {
      //skip listing images
      if (field === "listingImages") return;

      let value = draft[field as keyof typeof draft];
      //stringify non-string values
      if (field === "location" || field === "amenities") {
        value = JSON.stringify(value);
      }
      formData.append(field, value as string);
    });

    formData.append("listingStatus", status);

    await postNewListing(formData);
  };

  //feedback
  useEffect(() => {
    if (isError) toast.error(error as string);

    if (isSuccess) toast.success(data?.message);

    const timeoutId = setTimeout(() => {
      //on success//clear draft & reset to step 1
      if (isSuccess) handleReset();
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [isError, isSuccess, data]);

  return (
    <Dialog
      fullWidth //works together with max width
      maxWidth="lg" //default is small
      open={open}
      // onClose={handleClose}
    >
      <DialogTitle id="alert-dialog-title">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Box>
            <Intro pb={0}>Post a new listing</Intro>
            <DialogContentText>
              Follow the steps below to add a new listing
            </DialogContentText>
          </Box>

          <IconButton size="small" color="default" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ minHeight: "75vh" }}>
        <Stepper activeStep={activeStep}>
          {steps.map(({ label, altLabel }) => (
            <Step key={label}>
              <StepLabel
              // optional={
              //   <Typography color="muted.dark">{altLabel}</Typography>
              // }
              >
                {
                  <Typography fontWeight={600} variant="h6">
                    {label}
                  </Typography>
                }
              </StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box pt={5} px={2}>
          {steps[activeStep].content}
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          justifyContent: "space-between",
          borderTop: 1,
          borderColor: "gray.border",
          pb: 3,
          px: 2,
          pt: 2,
        }}
      >
        <Button
          variant="contained"
          onClick={handleBack}
          disabled={activeStep === 0}
          color="inherit"
        >
          Back
        </Button>

        {activeStep === maxSteps - 1 ? (
          <Box display="flex" columnGap={3}>
            <Button
              color="secondary"
              variant="contained"
              disabled={isLoading}
              endIcon={
                status === ListingStatus.Draft &&
                isLoading && <CircularProgress size={20} color="inherit" />
              }
              onClick={() => {
                saveListing(ListingStatus.Draft);
              }}
            >
              Save draft
            </Button>
            <Button
              variant="contained"
              disabled={isLoading}
              endIcon={
                status === ListingStatus.Available &&
                isLoading && <CircularProgress size={20} color="inherit" />
              }
              onClick={() => {
                saveListing(ListingStatus.Available);
              }}
            >
              Post
            </Button>
          </Box>
        ) : (
          <Button variant="contained" onClick={handleNext}>
            Next
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PostNew;
