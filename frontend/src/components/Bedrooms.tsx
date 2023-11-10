import { Box, Chip } from "@mui/material";
import { useEffect, useState } from "react";
import { FieldValues, UseFormReset } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { IListing } from "../types/listing";
import { TReset, TSetValue } from "../types/react-hook-form";

//see types here for r-hook-form //https://react-hook-form.com/ts#UseFormReturn //type starting with T are generic type you=  type you define for your inputs passed to useForm()
type BedroomsProps = {
  setValue: TSetValue; 
  defaultBedrooms: string;
};

const Bedrooms = ({ setValue, defaultBedrooms }: BedroomsProps) => {
  const { pathname } = useLocation();

  const [bedrooms, setBedrooms] = useState<string>(defaultBedrooms || "");

  const BEDROOMS = [
    "Single",
    "Bedsitter",
    "1 Bedroom",
    "2 Bedrooms",
    "3 Bedrooms",
    "4+ Bedrooms",
  ];
  pathname === "/" && BEDROOMS.unshift("");

  useEffect(() => {
    if (!bedrooms) return;

    setValue('bedrooms', bedrooms, { shouldValidate: true })
  
  }, [bedrooms]);

  return (
    <Box display="flex" gap={2} flexWrap="wrap">
      {BEDROOMS.map((bedroom, i) => {
        const label = parseInt(bedroom) ? parseInt(bedroom) : bedroom;
        return (
          <Chip
            key={i}
            onClick={() => setBedrooms(bedroom)}
            label={label === 4 ? "4+" : label === "" ? "Any" : label}
            color={bedroom === bedrooms ? "primary" : "default"}
            variant="filled"
            // size="small"
            sx={{ px: 1.5 }}
          />
        );
      })}
    </Box>
  );
};

export default Bedrooms;
