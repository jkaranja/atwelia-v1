import {
  Avatar,
  Box,
  CircularProgress,
  Divider,
  FormGroup,
  FormLabel,
  IconButton,
  InputAdornment,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  addToDraft,
  selectDraftListing,
} from "../features/listings/mylistings/listingSlice";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { useAppSelector } from "../hooks/useAppSelector";
import { TRegister } from "../types/react-hook-form";

type OverviewProps = {
  register: TRegister;
};

const Overview = ({ register }: OverviewProps) => {
  return (
    <Box>
      <FormGroup>
        <TextField
          {...register("overview", {
            required: "Overview is required",
            // maxLength: {
            //   value: 60,
            //   message: "Exceeded ",
            // },
          })}
          //label=""
          margin="dense"
          rows={4}
          multiline
          placeholder="e.g. A spacious 1 bedroom in a gated community. "
        />
      </FormGroup>
    </Box>
  );
};

export default Overview;
