import {
  Badge,
  Checkbox,
  Tabs,
  Typography
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/system/Box";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Intro from "../../components/Intro";
import MUIPagination from "../../components/MUIPagination";
import MyTab from "../../components/MyTab";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import useTitle from "../../hooks/useTitle";
import { ITour, TourStatus } from "../../types/tour";
import { selectCurrentRole } from "../auth/authSlice";
import { selectNotifications } from "../notifications/notificationSlice";
import {
  useClearToursMutation
} from "../notifications/notificationsApiSlice";
import TourItem from "./TourItem";
import { useGetAgentToursQuery } from "./tourApiSlice";
 

const STATUS = ["All", "Upcoming", "Completed", "Draft"];

const ToursList = () => {
  useTitle("Tours");

  const [status, setStatus] = useState("All");
  const [tabValue, setTabValue] = useState<string>("All");

  const role = useAppSelector(selectCurrentRole);

  const notifications = useAppSelector(selectNotifications);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [tours, setTours] = useState<ITour[]>([]);

  /* ----------------------------------------
   PAGINATION
   ----------------------------------------*/
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [clearTours, { isLoading: isClearing }] = useClearToursMutation();

  /* -------------------------------------------------------------
   FETCH TOURS
   ----------------------------------------------------------------*/
  const {
    currentData: data, //The latest returned result regardless of hook arg, if present.
    //currentData////The latest returned result for the current hook arg, if present.
    isFetching,
    isSuccess,
    isError,
    error,
    refetch,
    isLoading,
  } = useGetAgentToursQuery(
    { itemsPerPage, page, filters: { status } },
    {
      // pollingInterval: 1000 * 5,
      // refetchOnFocus: true,
      //last fetched time > 10 secs, refetch//use true |10
      refetchOnMountOrArgChange: true,
    }
  );

  //store results in states
  useEffect(() => {
    //update the other states
    setTours(data?.tours || []);
    setTotalPages(data?.pages || 0);
  }, [data]);

  /* ----------------------------------------
   HANDLE TAB + STATUS CHANGE
   ----------------------------------------*/
  const handleTabChange = (event: React.SyntheticEvent, tabValue: string) => {
    //change tour status
    setStatus(tabValue);
    //change tab
    setTabValue(tabValue);
  };

  /* ----------------------------------------
   HANDLE PAGINATION
   ----------------------------------------*/
  //for custom pagination & mui onchange
  const handlePageChange = (page: number) => {
    setPage(page);
  };

  /* ----------------------------------------
   ACTIONS-> CURRENT PAGE - 1
   ----------------------------------------*/
  useEffect(() => {
    //when action is performed eg delete & current page not 1st page and results are zero for current page, move to 1 page back: refetch with page-1
    //This will not fire when moving to a diff tab while page was not 1. B4 result for refetch triggered by status change returns, page is already is already update below to 1
    if (page !== 1 && isError) {
      handlePageChange(page - 1);
    }
  }, [isError]);
  /* ----------------------------------------
   RESET TO PAGE 1 ->STATUS CHANGE, PAGE!==1
   ----------------------------------------*/
  useEffect(() => {
    //when filters change, refetch with current page but if current page !==1, fire again with page===1
    //Possible refetch=2 times. Moving to diff tab & page !== 1: fire when status change, fire when page changes
    //This will not run due to actions eg delete since status/filters have not changed
    if (page !== 1) handlePageChange(1);
  }, [status]);

  /* ----------------------------------------
   RESET FILTERS
   ----------------------------------------*/
  const handleResetFilters = () => {
    handlePageChange(1);
    setStatus("Upcoming");
  };

  /* ----------------------------------------
   CLEAR NOTIFICATIONS PER STATUS
   ----------------------------------------*/
  useEffect(() => {
    if (!status) return;

    //as agent, notifications are only Unconfirmed & rescheduled
    //will only show these notifications
    if (status === "Unconfirmed") {
      clearTours({ tourStatus: status });
    }

    if (status === "Rescheduled") {
      clearTours({ tourStatus: status });
    }
  }, [status]);

  //count notifications
  const notification = useMemo(() => {
    return notifications?.tours?.reduce(
      (acc, current) => {
        if (current.tourStatus === TourStatus.Unconfirmed) {
          acc.unconfirmed += 1;
        }
        if (current.tourStatus === TourStatus.Rescheduled) {
          acc.rescheduled += 1;
        }
        return acc;
      },
      { unconfirmed: 0, rescheduled: 0 }
    );
  }, [notifications]);

  return (
    <Box>
      <Intro>Tours manager</Intro>
      <Typography
        color="muted.dark"
        pb={{ xs: 2, lg: 0 }}
        gutterBottom
        paragraph
      >
        Keep track of your upcoming tour requests from clients
      </Typography>

      <TableContainer sx={{ maxHeight: "75vh" }} component={Paper}>
        <Box sx={{ borderBottom: 1, borderColor: "dull.light" }} mb={4}>
          <Tabs
            sx={{ maxWidth: "85vw" }}
            value={tabValue}
            onChange={handleTabChange}
            aria-label="basic tabs example"
            textColor="primary"
            indicatorColor="primary"
            variant="scrollable"
            allowScrollButtonsMobile //Present scroll buttons always regardless of the viewport width on mobile//keep this
          >
            {STATUS.map((value, i) => (
              <MyTab
                label={
                  <Box sx={{ display: "flex", pr: 1.5 }}>
                    <Badge
                      badgeContent={
                        value === TourStatus.Unconfirmed
                          ? notification?.unconfirmed
                          : value === TourStatus.Rescheduled
                          ? notification?.rescheduled
                          : 0
                      }
                      max={999} //default: 99
                      color="warning"
                      // overlap="circular"
                      //anchorOrigin={{ vertical: 'top',horizontal: 'right',}}//move the badge to any corner
                      // showZero
                    >
                      <Typography pl={1}>{value}</Typography>
                    </Badge>
                  </Box>
                }
                value={value}
              />
            ))}
          </Tabs>
        </Box>

        <Table
          sx={{ minWidth: "65vw" }}
          aria-label="simple table"
          size="small"
          stickyHeader
        >
          <TableHead>
            <TableRow>
              <TableCell
                padding="checkbox"
                align="left"
                sx={{ minWidth: "11%" }}
              >
                <Box
                  sx={{ display: "flex" }}
                  justifyContent="flex-start"
                  alignItems="center"
                >
                  <Checkbox
                  //checked={isBulkChecked}
                  // onChange={handleBulkCheck}
                  // indeterminate={
                  //   isBulkChecked && //when isBulkChecked is true
                  //   orderList.some((order) => !order.isChecked) //but there is also at least one false
                  // }
                  />
                  <Typography component="span" variant="subtitle1">
                    Listing
                  </Typography>
                </Box>
              </TableCell>

              <TableCell>Listing</TableCell>

              <TableCell>Client name</TableCell>

              <TableCell>Tour date</TableCell>

              <TableCell>status</TableCell>

              <TableCell align="center">Manage</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tours?.map((tour) => (
              <TourItem key={tour._id} tour={tour} handleChecked={() => {}} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box py={4}>
        <MUIPagination
          count={totalPages}
          page={page}
          //redirect="/tours?page" //when using render item
          changePage={handlePageChange}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
        />
      </Box>
    </Box>
  );
};

export default ToursList;
