import { Box, IconButton, InputAdornment, TextField } from "@mui/material";
import React from "react";
import { TRegister } from "../types/react-hook-form";

type ListingPriceProps = {
  register: TRegister;
};

const ListingPrice = ({ register }: ListingPriceProps) => {
  return (
    <Box className="">
      <TextField
        {...register("price", {
          // setValueAs: (v) => v.replace(/[^0-9]/g, "") || "0",
          //valueAsNumber: true
        })}
        type="number"
        //margin="dense"
        //size="small"
        // color="secondary"
        fullWidth
        //placeholder="0"
        // label="Rent  in Ksh)"
        InputProps={{
          startAdornment: <InputAdornment position="start">Ksh</InputAdornment>,
        }}
      />
    </Box>
  );
};

export default ListingPrice;
