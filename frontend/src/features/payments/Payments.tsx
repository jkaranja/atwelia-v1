import { Box, Button, Tabs, Typography } from "@mui/material";
import React, { useState } from "react";
import CommitIcon from "@mui/icons-material/Commit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AssessmentIcon from "@mui/icons-material/Assessment";
import TollIcon from "@mui/icons-material/Toll";
import { useNavigate } from "react-router-dom";
import MyTab from "../../components/MyTab";
import TabPanel from "../../components/TabPanel";
import useTitle from "../../hooks/useTitle";
import Activity from "./Activity";
import CommissionsList from "./CommissionsList";
import Intro from "../../components/Intro";

const Payments = () => {
  useTitle("Payment");

  const navigate = useNavigate();

  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, tabValue: number) => {
    setTabValue(tabValue);
  };

  return (
    <Box>
      <Intro>Payments</Intro>

      <Box sx={{ borderBottom: 1, borderColor: "dull.light" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="basic tabs example"
          textColor="primary"
          indicatorColor="primary"
          // variant="fullWidth"
        >
          <MyTab
            label={
              <Box sx={{ display: "flex" }}>
                <CommitIcon />
                <Typography pl={1}>Commissions</Typography>
              </Box>
            }
          />
          <MyTab
            label={
              <Box sx={{ display: "flex" }}>
                <AssessmentIcon />
                <Typography pl={1}>Activity</Typography>
              </Box>
            }
            value={1}
          />
        </Tabs>
      </Box>

      <Box>
        {/* ----------------------ADD MONEY TAB -------------------------*/}
        <TabPanel value={tabValue} index={0}>
          <CommissionsList />
        </TabPanel>

        {/* ---------------------Activity TAB------------------------ */}
        <TabPanel value={tabValue} index={1}>
          {<Activity />}
        </TabPanel>
      </Box>
    </Box>
  );
};

export default Payments;
