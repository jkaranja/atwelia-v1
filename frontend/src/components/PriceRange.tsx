import {
  Box,
  InputAdornment,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";

type PriceRangeProps = {
  priceRange: Array<number>;
  setPriceRange: React.Dispatch<React.SetStateAction<number[]>>;
};

const PriceRange = ({ priceRange, setPriceRange }: PriceRangeProps) => {
  return (
    <Box>
      <Box display="flex" alignItems="center" columnGap={1}>
        <TextField
          placeholder="0"
          //error={false}//Whether to style the TextInput with error style.
          //label="Username"
          value={priceRange[0]}
          onChange={(e) =>
            setPriceRange((prev) => [parseInt(e.target.value) || 0, prev[1]])
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">Ksh</InputAdornment>
            ),
          }}
        />
        <Typography>To</Typography>

        <TextField
          type="number"
          inputProps={{ max: 500000, min: 100 }}
          placeholder="0"
          // label="Username"
          value={priceRange[1]}
          onChange={(e) =>
            setPriceRange((prev) => [prev[0], parseInt(e.target.value) || 0])
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">Ksh</InputAdornment>
            ),
          }}
        />
      </Box>

      <Box pt={3} px={5}>
        <Slider
          getAriaLabel={() => "Price range"}
          value={priceRange}
          onChange={(e, newValue: number | number[]) =>
            setPriceRange(newValue as number[])
          }
          valueLabelDisplay="auto" //You can force the thumb label to be always visible with valueLabelDisplay="on" or "off" to remove
          getAriaValueText={(value) => `Ksh ${value}`}
          //color="secondary"
          //disableSwap
          //size="small"
          step={50}
          //marks //boolean | Array<{value:number, label: "" }>//Note: if max= big number, calculating marks is expensive
          min={100}
          max={500000}
          // sx={{width: "85%"}}
        />
      </Box>
    </Box>
  );
};

export default PriceRange;
