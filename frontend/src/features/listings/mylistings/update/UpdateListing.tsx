import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { skipToken } from "@reduxjs/toolkit/dist/query";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";
import { useAppSelector } from "../../../../hooks/useAppSelector";

import Intro from "../../../../components/Intro";
import compressImage from "../../../../utils/compressImage";
import { useGetListingQuery } from "../../view/viewApiSlice";
import { useUpdateListingMutation } from "../listingApiSlice";
import {
  addToUpdated,
  resetUpdated,
  selectUpdatedListing,
} from "../listingSlice";
import FactsForm from "./FactsForm";
import GeneralForm from "./GeneralForm";

type UpdateListingProps = {
  open: boolean;
  handleClose: () => void;
  id: string;
};

const UpdateListing = ({ open, handleClose, id }: UpdateListingProps) => {
  const [activeStep, setActiveStep] = useState(0);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const updated = useAppSelector(selectUpdatedListing);

  /* ----------------------------------------
   FETCH LISTING
   ----------------------------------------*/

  const {
    data: listing,
    isFetching,
    isSuccess: isFetched,
    isError: isFetchErr,
    error: fetchErr,
  } = useGetListingQuery(id ?? skipToken, {
    //pollingInterval: 15000,
    //refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const [updateListing, { data, error, isLoading, isError, isSuccess }] =
    useUpdateListingMutation();

  const steps = [
    {
      label: "Facts & features",
      altLabel: "Facts and features",
      content: <FactsForm />,
    },

    {
      label: "Photos ",
      altLabel: "Wrap things up ",
      content: <GeneralForm />,
    },
  ];

  const maxSteps = steps.length;
  //handle next btn
  const handleNext = () => {
    //check required fields

    if (activeStep === 0) {
      const isValid =
        updated.location &&
        updated.bathrooms &&
        updated.bedrooms &&
        updated.price;

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
    dispatch(resetUpdated());
    handleClose();
  };

  //submit data
  const handleUpdateListing = async () => {
    //last step fields validation

    //check photos at least 3//as a Type guard too
    if (!updated.listingImages || updated.listingImages.length < 3) {
      return toast.error("Please add at least 3 photos");
    }

    const formData = new FormData();

    //filter out new images//to be appended to files//could be 0 or more// name will be valid
    const newImages = updated.listingImages.filter((file) => file.name);
    //append new images
    newImages.forEach((img) => {
      formData.append("files", img as File); //if value is not a string | Blob/File, it will be converted to string
    });

    //append first pic to be the featured image//could be a new image or already uploaded one(same or diff)
    //file object(if new img) will behave diff from a normal object eg:
    //const { lastModifiedDate, ...safeImg } = updated.listingImages[0];//safeImg = {}, lastModifiedDate = date/okay
    //even stringify-ing it will send an empty object
    //sol: filter out only what we need
    const { name, filename, size } = updated.listingImages[0];
    formData.append(
      "featured", //JSON values can't be undefined
      JSON.stringify({ name: name || "", filename: filename || "", size })
    );

    //filter out remaining already uploaded images//could be 0 or same as b4//filename will be valid
    //will use this list to delete from server i.e compare existing and removed
    const modifiedUploaded = updated.listingImages.filter(
      (file) => file.filename
    );
    const modifiedUploadedNames = modifiedUploaded.map((img) => img.filename); //reduces bandwidth//don't need whole file object
    //append uploaded files names(always unique for uploaded files)
    formData.append("uploaded", JSON.stringify(modifiedUploadedNames));

    //append the rest
    Object.keys(updated).forEach((field, i) => {
      //skip appending listing images
      if (field === "listingImages") return;
      //skip the current featured img
      if (field === "featuredImage") return;

      let value = updated[field as keyof typeof updated];
      //stringify non-string values
      if (field === "location" || field === "amenities") {
        value = JSON.stringify(value);
      }
      formData.append(field, value as string);
    });

    await updateListing({ id, data: formData });
  };

  //update store with listing
  useEffect(() => {
    if (!listing) return;

    dispatch(resetUpdated()); //reset updated state//clear entries from prev listing
    //dispatch is synchronous
    dispatch(addToUpdated(listing));
  }, [listing]);

  //feedback
  useEffect(() => {
    if (isError) toast.error(error as string);

    if (isSuccess) toast.success(data?.message);

    const timeoutId = setTimeout(() => {
      //on success//close & //clear updated from store
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
            <Intro pb={0}>Update listing details</Intro>
            <DialogContentText>
              Follow the steps below to update the listing
            </DialogContentText>
          </Box>

          <IconButton size="small" color="default" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ minHeight: "75vh" }}>
        <Box display="flex" justifyContent="center">
          {!listing && <CircularProgress color="inherit" />}
        </Box>
        {!!Object.keys(updated).length && (
          <Box>
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
            <Box py={5} px={2}>
              {steps[activeStep].content}
            </Box>
          </Box>
        )}
      </DialogContent>

      {!!Object.keys(updated).length && (
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
                onClick={handleReset}
              >
                Discard changes
              </Button>
              <Button
                variant="contained"
                disabled={isLoading}
                endIcon={
                  isLoading && <CircularProgress size={20} color="inherit" />
                }
                onClick={handleUpdateListing}
              >
                Update
              </Button>
            </Box>
          ) : (
            <Button variant="contained" onClick={handleNext}>
              Next
            </Button>
          )}
        </DialogActions>
      )}
    </Dialog>
  );
};

export default UpdateListing;
