import { Box, IconButton } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";

import CloseIcon from "@mui/icons-material/Close";
import HowItWorks from "./HowItWorks";
import ProfileForm from "./ProfileForm";
import WhatNext from "./WhatNext";


type OnboardProps = {
  open: boolean;
  handleClose: () => void;
};

const Onboard = ({ open, handleClose }: OnboardProps) => {
  const [activeStep, setActiveStep] = useState(1);

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack= () => {
    setActiveStep((prev) => prev - 1);
  };

  return (
    <Box>
      <Dialog
        fullWidth //works together with max width
        maxWidth="md" //default is small
        open={open}
        //onClose={handleClose}
      >
        <DialogTitle id="alert-dialog-title" sx={{ p: 0 }}>
          <Box display="flex" justifyContent="flex-end">
            <IconButton size="large" color="default" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box>
            {activeStep === 1 && <HowItWorks handleNext={handleNext} />}
            {activeStep === 2 && (
              <ProfileForm handleNext={handleNext} handleBack={handleBack} />
            )}
            {activeStep === 3 && <WhatNext handleClose={handleClose} />}
          </Box>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={handleClose}>Cancel</Button> */}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Onboard;
