import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

type AlertDialogProps = {
  open: boolean;
  handleClose: () => void;
  handleAction: () => void;
  message: string;
};

const AlertDialog = ({
  open,
  handleClose,
  handleAction,
  message,
}: AlertDialogProps) => {
  const handleClick = () => {
    //close the dialog
    handleClose();
    //run onSubmit handler
    handleAction();
  };

  return (
    <Dialog
      fullWidth //works together with max width
      maxWidth="xs" //default is small
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {message || "Confirm operation?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description"></DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleClick} autoFocus>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;
