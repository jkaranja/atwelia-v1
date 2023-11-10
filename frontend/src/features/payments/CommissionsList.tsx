import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  TableContainer,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";

import { Link, useSearchParams } from "react-router-dom";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
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
import { ICommission, useGetCommissionsQuery } from "./paymentApiSlice";
import PaymentsIcon from "@mui/icons-material/Payments";
import PayNow from "./PayNow";
import { PROFILE_PIC_ROOT } from "../../constants/paths";

const CommissionsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  //filter
  //order: set dates as '', dates are sent as GET query string so undefined or null will be sent as string = true
  const [startDate, setStartDate] = useState<string | Date>("");
  const [endDate, setEndDate] = useState<string | Date>("");
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  const [commissionList, setCommissionList] = useState<ICommission[]>([]);

  //dialogs
  const [openPayD, setOpenPayD] = useState(false);
  const handleTogglePayD = () => setOpenPayD((prev) => !prev);

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
  } = useGetCommissionsQuery(
    { currentPage, itemsPerPage },
    {
      // pollingInterval: 15000,
      // refetchOnFocus: true,
      refetchOnMountOrArgChange: true,
    }
  );

  //store data in states
  useEffect(() => {
    setCommissionList(data?.commissions || []);
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
      {openPayD && data?.balance && (
        <PayNow open={openPayD} handleClose={handleTogglePayD} balance={0} />
      )}
      <Alert severity="info">
        As an agent offering rental services, you're required to pay a
        commission of Ksh 100 for every successful tour. This fee should be
        included in your tour fee which you can update under{" "}
        <Link to="/profile">profile</Link>. Please clear any balance below to
        avoid account deactivation.{" "}
      </Alert>

      <Box display="flex" justifyContent="space-between" py={2} my={2}>
        <Chip color="warning" label={`Balance: Ksh ${data?.balance || 0}`} />

        <Button
          startIcon={<PaymentsIcon />}
          disabled={!data?.balance}
          variant="contained"
          onClick={handleTogglePayD}
          color="secondary"
        >
          Pay balance
        </Button>
      </Box>

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
        {commissionList.map((commission) => (
          <List key={commission._id}>
            <ListItem
              alignItems="flex-start"
              secondaryAction={
                <Box>
                  <Typography
                    color="warning.main"
                    textAlign={{ xs: "right", sm: "left" }}
                  >
                    {`Ksh ${commission.amount}`}
                  </Typography>

                  <Typography color="dark.main" variant="caption">
                    {commission.status}
                  </Typography>
                </Box>
              }
            >
              <ListItemAvatar>
                <Avatar
                  alt={commission.renter?.username}
                  src={`${PROFILE_PIC_ROOT}/${commission.renter?.profile?.profilePic?.filename}`}
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box>
                    <Typography variant="subtitle1" color="dark.main">
                      {commission.renter?.username}
                    </Typography>

                    <Box display="flex" alignItems="center">
                      <Typography pr={2}>
                        {commission.listing?.bedrooms}
                      </Typography>
                      <LocationOnOutlinedIcon fontSize="small" color="action" />
                      <Typography>
                        {commission.listing?.location?.description}
                      </Typography>
                    </Box>
                  </Box>
                }
                secondary={
                  <Typography color="muted.main" variant="body2">
                    Ended on:{" "}
                    {format(
                      new Date(commission?.updatedAt || Date.now()),
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

export default CommissionsList;
