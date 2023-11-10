import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { Footer } from "../../components/Footer";
import DashHeader from "./DashHeader";
import usePaymentNotification from "../../hooks/usePaymentNotification";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import { Alert, Button, Paper, Typography } from "@mui/material";

const DashLayout = () => {
  //const isExceeded = usePaymentNotification();

  return (
    <Grid2
      //spacing={} //horizontal// rowSpacing for vertical
      container //adds flex behavior//span 12 cols //row//display block
      direction="column"
      justifyContent="space-between"
      // alignItems="stretch"
      minHeight="100vh"
      bgcolor="gray.main"
    >
      {/* account bar is fixed//add a box with min height to push items down */}
      <Grid2 minHeight={65} className="back-to-top-anchor">
        <DashHeader />
      </Grid2>

      <Grid2 xs container justifyContent="center">
        <Box
          width={{ xs: "100vw", md: "90vw", lg: "80vw", xl: "70vw" }}
          //width={{ xs: "100vw", lg: 1250 }}
          px={3}
          pt={6}
        >
          {/* {isExceeded && (
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              bgcolor="rgb(255, 244, 229)"
              color="rgb(102, 60, 0)"
              px={2}
              py={1}
              my={2}
            >
              <Box display="flex" alignItems="center">
                <ReportProblemOutlinedIcon />
                <Typography component="span" px={1}>
                  You have exceeded the allowed outstanding balance limit.
                  Please clear balance to continue using our services.
                </Typography>
              </Box>

              <Button
                size="small"
                variant="contained"
                color="secondary"
                component={Link}
                to={`/payments`}
                sx={{
                  textTransform: "none",
                  whiteSpace: "nowrap",
                  minWidth: 110,
                }}
              >
                Pay balance
              </Button>
            </Box>
          )} */}
          <Outlet />
        </Box>
      </Grid2>
      <Grid2 container flexDirection="column" justifyContent="flex-start">
        <Footer />
      </Grid2>
    </Grid2>
  );
};

export default DashLayout;
