import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";

import { useNavigate } from "react-router-dom";
import Intro from "../../components/Intro";

type WhatNextProps = {
  handleClose: () => void;
};

const WhatNext = ({ handleClose }: WhatNextProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    handleClose();
    navigate("/listings");
  };

  return (
    <Box>
      <Intro pb={4}>Your are all set!</Intro>

      <Typography paragraph>
        You can now go ahead and post vacant houses and wait for interested
        clients to contact you.
      </Typography>

      <Typography paragraph>Cheers!</Typography>

      <Box py={4}>
        <Button onClick={handleClick} variant="outlined">
          Manage listings
        </Button>
      </Box>
    </Box>
  );
};

export default WhatNext;
