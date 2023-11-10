import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  IconButton,
  List,
  ListItemAvatar,
  ListItemIcon,
  Typography,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";

import EditIcon from "@mui/icons-material/Edit";
import LightModeIcon from "@mui/icons-material/LightMode";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetUserQuery } from "../auth/userApiSlice";
import { useDepositMutation } from "./paymentApiSlice";

type PayNowProps = {
  open: boolean;
  handleClose: () => void;
  balance: number;
};

const PayNow = ({ open, handleClose, balance }: PayNowProps) => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };
  /* -------------------------------------------------------------
   FETCH USER
   ----------------------------------------------------------------*/
  const { data: user, isFetching } = useGetUserQuery(undefined, {
    // pollingInterval: 15000,
    // refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  const [deposit, { isLoading, isSuccess, isError, error, data }] =
    useDepositMutation();

  //r-hook-form
  type Inputs = {
    amount: string | number;
  };
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, submitCount },
    reset: resetForm,
    control,
    watch,
    getValues,
    setValue,
  } = useForm<Inputs>();

  const onSubmit = async (data: Inputs) => {
    await deposit({ amount: balance });
  };

  //set defaults
  useEffect(() => {
    resetForm({
      amount: balance,
    });
  }, [user]);

  //feedback
  useEffect(() => {
    if (isError) toast.error(error as string);

    if (isSuccess) toast.success(data?.message);

    if (isSuccess) handleClose();

    //return () => toast.dismiss();//don't dismiss
  }, [isError, isSuccess]);

  return (
    <Box>
      <Dialog
        fullWidth //works together with max width
        maxWidth="md" //default is small
        open={open}
        //onClose={handleClose}
      >
        <DialogTitle id="alert-dialog-title" sx={{ pb: 0 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h5" gutterBottom>
              Pay balance
            </Typography>

            <IconButton size="large" color="default" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent sx={{ py: 0 }}>
            <DialogContentText id="alert-dialog-description"></DialogContentText>

            <Box py={2}>
              <Chip color="warning" label={`Balance: Ksh ${balance}`} />
            </Box>

            <Typography gutterBottom>
              Follow the steps below to clear your balance
            </Typography>

            <List>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar>1</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="h6" gutterBottom>
                      Confirm phone number
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography gutterBottom paragraph>
                        Is the phone number below the one making the payment? If
                        not, update under <Link to="/settings">account</Link>.
                      </Typography>
                      <Typography component="span" color="warning.main">
                        {user?.phoneNumber || "No phone number added. "}
                      </Typography>

                      <Link to="/settings">
                        <EditIcon color="primary" />
                      </Link>
                    </Box>
                  }
                />
              </ListItem>

              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar>2</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="h6" gutterBottom>
                      Submit and authorize the payment
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography gutterBottom paragraph>
                        Click the submit button below. You will receive a prompt
                        on your phone to authorize the payment. Enter your PIN
                        and click 'Send'.
                      </Typography>
                      <Typography paragraph gutterBottom>
                        After getting the M-Pesa confirmation message, please{" "}
                        <Link reloadDocument to="/payments">
                          refresh page
                        </Link>{" "}
                        to check if the balance was cleared.
                      </Typography>
                      {/* <FormGroup sx={{ mb: 2 }}>
                        <TextField
                          {...register("amount", {
                            required: "Amount is required",
                            min: {
                              value: balance,
                              message: "Amount must match balance",
                            },
                            max: {
                              value: balance,
                              message: "Amount must match balance",
                            },
                          })}
                          type="number"
                          margin="dense"
                          //size="small"
                          // color="secondary"
                          fullWidth
                          //placeholder="0"
                          //label=""
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                Ksh
                              </InputAdornment>
                            ),
                          }}
                        />
                        <Typography color="error.main" variant="caption">
                          {errors.amount?.message}
                        </Typography>
                      </FormGroup> */}

                      <Box>
                        <Button
                          type="submit"
                          variant="contained"
                          disabled={isLoading}
                          endIcon={
                            isLoading && (
                              <CircularProgress size={20} color="inherit" />
                            )
                          }
                        >
                          Submit
                        </Button>
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
            </List>

            <Box py={4}>
              <Accordion
                expanded={expanded === "panel1"}
                onChange={handleChange("panel1")}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <LightModeIcon color="warning" />
                  <Typography px={2}>
                    Didn't get the prompt (a pop up on your phone)?
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List dense disablePadding>
                    <ListItem>
                      <ListItemIcon>
                        <Typography px={2}>Option 1: </Typography>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography>
                            Resend the prompt by clicking the submit button
                            again. If that didn't work, see option 2 below.
                          </Typography>
                        }
                      />
                    </ListItem>
                    <ListItem alignItems="flex-start">
                      <ListItemIcon>
                        <Typography px={2}>Option 2:</Typography>
                      </ListItemIcon>

                      <ListItemText
                        primary={
                          <Typography paragraph>
                            You can also clear your balance by sending money
                            directly to our Till Number: {""}
                            <span style={{ fontWeight: "bold" }}>
                              {" "}
                              5139511.
                            </span>{" "}
                            It will display 'CLIENTLANCE SYSTEMS' as the
                            recipient.
                          </Typography>
                        }
                        secondary={
                          <Typography>
                            After sending the money to the till number above,
                            please{" "}
                            <Link reloadDocument to="/payments">
                              refresh page
                            </Link>{" "}
                            to check if the balance was cleared.
                          </Typography>
                        }
                      />
                    </ListItem>
                  </List>
                </AccordionDetails>
              </Accordion>
              <Accordion
                expanded={expanded === "panel2"}
                onChange={handleChange("panel2")}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2bh-content"
                  id="panel2bh-header"
                >
                  <LightModeIcon color="warning" />
                  <Typography px={2}>Need help?</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List dense disablePadding>
                    <ListItem alignItems="flex-start" >
                      <ListItemText
                        primary={
                          <Typography px={1}>
                            If you sent the money but the balance hasn't cleared
                            yet, please wait for up to 1 minute and refresh the
                            page again. If still nothing, please contact us on
                            WhatsApp: +254799295587 or email us at
                            support@atwelia.com.
                          </Typography>
                        }
                      />
                    </ListItem>
                  </List>
                </AccordionDetails>
              </Accordion>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 4 }}></DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default PayNow;
