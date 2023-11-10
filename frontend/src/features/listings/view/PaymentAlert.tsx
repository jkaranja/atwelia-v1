import CloseIcon from "@mui/icons-material/Close";
import {
  Alert,
  Box,
  FormGroup,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import useAuth from "../../../hooks/useAuth";

type PaymentAlertProps = {
  open: boolean;
  handleClose: () => void;
};

const PaymentAlert = ({ open, handleClose }: PaymentAlertProps) => {
  

  // const [deposit, { isLoading, isSuccess, isError, error, data }] =
  //   useDepositMutation();

  const [phoneNumber, setPhoneNumber] = useState( "");

  const [isInvalidAmount, setIsInvalidAmount] = useState(false);

  const [amount, setAmount] = useState(20);

  // /* -------------------------------------------------------------
  //  FETCH WALLET INFO
  //  ----------------------------------------------------------------*/
  // const { data: wallet } = useGetWalletInfoQuery(undefined, {
  //   skip: !isSuccess, //start polling when prompt is sent
  //   // pollingInterval: 1000 * 5,//in ms
  //   // refetchOnFocus: true,
  //   //last fetched time > 10 secs, refetch//use true |10
  //   refetchOnMountOrArgChange: 10, //in secs
  // });

  const handleSubmit = async () => {
    if (amount < 20) return setIsInvalidAmount(true);

    //await deposit({ phoneNumber, amount });
  };

  useEffect(() => {
    if (amount >= 20) return setIsInvalidAmount(false);
  }, [amount]);

  // useEffect(() => {
  //   if (wallet?.balance) {
  //     handleClose();
  //     toast.success("Thank you for the tea! You can now view all contacts. ");
  //   }
  // }, [wallet]);

  return (
    <Dialog
      fullWidth //works together with max width
      maxWidth="sm" //default is small
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" sx={{ p: 0 }}>
        <Box display="flex" justifyContent="flex-end">
          <IconButton size="large" color="primary" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description"></DialogContentText>

        {/* {isSuccess ||
          (isError && (
            <Alert severity={isSuccess ? "success" : "error"} sx={{ mb: 2 }}>
              {isError &&
                "Oops! The prompt couldn't be sent. Please try again or send the money to our Till"}

              {isSuccess &&
                "Prompt sent. Please check your phone and confirm payment."}
            </Alert>
          ))} */}

        <Typography variant="h5" paragraph>
          Buy us a cup of tea to unlock all contacts
        </Typography>

        <Typography paragraph>
          Enter your phone number and amount not less than Ksh 20 to unlock all
          contacts.
        </Typography>

        <Typography color="muted.main" paragraph>
          We will send a prompt to your phone to confirm payment.
        </Typography>

        <FormGroup sx={{ mb: 2 }}>
          <PhoneInput
            country={"ke"}
            onlyCountries={["ke"]}
            inputProps={{ required: true, autoFocus: true }} //	object	props to pass into the input eg  = {{ name: 'phone', required: true, autoFocus: true}}
            value={phoneNumber} //input state value
            onChange={(phone) => setPhoneNumber(`+${phone}`)} //onChange(value, country: { name, dialCode, countryCode (iso2) }, event, formattedValue)//value = phoneNumber without the '+'
            countryCodeEditable={false}
            inputStyle={{ height: 55, width: "100%" }}
            containerStyle={{ height: 55 }}
          />
        </FormGroup>

        <FormGroup sx={{ mb: 0.5 }}>
          <TextField
            value={amount}
            onChange={(e) =>
              setAmount(parseInt(e.target.value.replace(/[^0-9]/g, "")) || 0)
            }
            label="Amount"
            margin="dense"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">Ksh</InputAdornment>
              ),
            }}
          />
        </FormGroup>

        {isInvalidAmount && (
          <Typography color="error.main" variant="caption">
            Minimum amount is Ksh 20
          </Typography>
        )}

        <Typography color="muted.main" pt={2}>
          Didn't get the prompt? Send the amount to our Till Number: 34555555{" "}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 4 }}>
        <Button variant="contained" onClick={handleSubmit}>
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentAlert;
