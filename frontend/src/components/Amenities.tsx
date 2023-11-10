import { Box, Checkbox, FormControlLabel, ListItemButton } from "@mui/material";
import { Control, Controller } from "react-hook-form";

import { AMENITIES } from "../features/listings/mylistings/post/FactsForm";
import { TAmenitiesInputs, TFactInputs } from "../types/react-hook-form";

type AmenitiesProps = {
  control: Control<TFactInputs>;
};
const Amenities = ({ control }: AmenitiesProps) => {
  return (
    <Box border={1} borderRadius={1} p={1} borderColor="gray.border">
      <Box maxHeight={280} overflow="auto">
        {AMENITIES.map((item, i) => {
          const key = item.key as keyof TAmenitiesInputs;
          return (
            <ListItemButton key={key + i}>
              <FormControlLabel
                sx={{ width: "100%" }}
                control={
                  <Controller
                    name={`amenities.${key}`}
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        onChange={(e) => field.onChange(e.target.checked)}
                        checked={field.value}
                      />
                    )}
                  />
                }
                label={item.value}
              />
            </ListItemButton>
          );
        })}
      </Box>
    </Box>
  );
};

export default Amenities;
