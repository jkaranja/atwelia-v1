import {
  Box,
  CircularProgress,
  Divider,
  Paper,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

import { useSearchParams } from "react-router-dom";

import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import { format } from "date-fns";
import MUIPagination from "../../components/MUIPagination";
import useDebounce from "../../hooks/useDebounce";
import { IActivity, useGetActivitiesQuery } from "./paymentApiSlice";

// type ActivityProps = {
// }
const Activity = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  //filter
  //order: set dates as '', dates are sent as GET query string so undefined or null will be sent as string = true
  const [startDate, setStartDate] = useState<string | Date>("");
  const [endDate, setEndDate] = useState<string | Date>("");
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  const [activityList, setActivityList] = useState<IActivity[]>([]);

  /* ----------------------------------------
   PAGINATION
   ----------------------------------------*/
  //const currentPage = searchParams.get("page") || 1; //for mui render//changes on url change
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") as string) || 1
  );
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const {
    currentData: data,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetActivitiesQuery(
    { currentPage, itemsPerPage },
    {
      // pollingInterval: 15000,
      // refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  //store data in states
  useEffect(() => {
    setActivityList(data?.activities || []);
    setTotalPages(data?.pages || 0);
  }, [data]);
  /* ----------------------------------------
   PAGINATION
   ----------------------------------------*/
  //for custom pagination & mui onchange
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    //update url
    setSearchParams({ page: page.toString() });
  };

  return (
    <Box component={Paper} p={3}>
      <Box display="flex" color="muted.main" px={2}>
        <Typography variant="body2">
          {isFetching ? (
            <CircularProgress color="inherit" size={20} />
          ) : (
            data?.total || 0
          )}
        </Typography>
        <Typography variant="body2" px={0.5}>
          records
        </Typography>
      </Box>

      <Box maxHeight="60vh" overflow="auto" minHeight="20vh">
        {activityList.map((activity) => (
          <List key={activity._id}>
            <ListItem
              secondaryAction={
                <Box>
                  <Typography
                    color="warning.main"
                    textAlign={{ xs: "right", sm: "left" }}
                  >
                    {`Ksh ${activity.amount}`}
                  </Typography>

                  <Typography
                    color="muted.main"
                    variant="caption"
                  >{`Balance: Ksh 0 `}</Typography>
                </Box>
              }
            >
              <ListItemAvatar>
                <Avatar
                  alt="D"
                  src="/static/images/avatar/1.jpg"
                  sx={{
                    bgcolor: "warning.light",
                  }}
                >
                  <AddIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={<Typography>Outstanding balance paid</Typography>}
                secondary={
                  <Typography color="muted.main" variant="body2">
                    {format(
                      new Date(activity?.updatedAt || Date.now()),
                      "dd MMM, yyyy"
                    )}
                  </Typography>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
          </List>
        ))}
      </Box>

      <Box py={4}>
        <MUIPagination
          count={totalPages}
          page={currentPage}
          changePage={handlePageChange}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
        />
      </Box>
    </Box>
  );
};

export default Activity;
