import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Divider, Fab, Typography, useScrollTrigger } from "@mui/material";
import Fade from "@mui/material/Fade";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Box } from "@mui/system";
import { Link } from "react-router-dom";

export const Footer = () => {
  //will return true if you cross 100px from top
  const trigger = useScrollTrigger({
    disableHysteresis: true, //required//if not added/false, trigger = true when you scroll down past threshold bt turns false when you scroll up
    threshold: 100, //default is 100px//detect when you scroll down and hit min of 100 from top//becomes true
  });
  //on click get the anchor id(see id in navbar), scroll up and put it into viewport
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    const anchor = (
      (event.target as HTMLElement).ownerDocument || document
    ).querySelector(".back-to-top-anchor");

    if (anchor) {
      anchor.scrollIntoView({
        block: "center",
      });
    }
  };
  //below, Fade children component must not be a Fab/btn //box working

  return (
    <Box color="#fff" bgcolor="#242145" py={4}>
      <Box display="flex" justifyContent="center" columnGap={2} pb={2}>
        <Typography variant="caption">WhatsApp: +1(555) 021-2523 </Typography>
        <Typography variant="caption">Email: support@atwelia.com</Typography>
      </Box>
      <Divider sx={{ borderColor: "#404376!important" }} />
      <Box display="flex" justifyContent="center" columnGap={2} pt={2}>
        <Typography variant="caption" component="span">
          @{new Date().getFullYear()} All rights reserved
        </Typography>

        <Typography
          color="warning.light"
          component={Link}
          to="/terms"
          sx={{ textDecoration: "none" }}
          variant="caption"
          px={2}
        >
          Terms of use
        </Typography>

        <Typography
          color="warning.light"
          component={Link}
          to="/privacy"
          sx={{ textDecoration: "none" }}
          variant="caption"
        >
          Privacy policy
        </Typography>
      </Box>

      <Fade in={trigger}>
        <Box
          onClick={handleClick}
          sx={{ position: "fixed", bottom: 16, right: 16 }}
        >
          <Fab size="medium" color="error" aria-label="scroll back to top">
            <KeyboardArrowUpIcon />
          </Fab>
        </Box>
      </Fade>
    </Box>
  );
};
