import { Box, Chip } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { TReset, TSetValue } from "../types/react-hook-form";

type BathroomsProps = {
  setValue: TSetValue;
  defaultBathrooms: string;
};
const Bathrooms = ({ setValue, defaultBathrooms }: BathroomsProps) => {
  const { pathname } = useLocation();

  const [bathrooms, setBathrooms] = useState<string>(defaultBathrooms || "");

  const BATHROOMS = [
    "1 Bathroom",
    "2 Bathrooms",
    "3 Bathrooms",
    "4+ Bathrooms",
  ];
  pathname === "/" && BATHROOMS.unshift("");

  useEffect(() => {
    if (!bathrooms) return;

    setValue("bathrooms", bathrooms, { shouldValidate: true });
  }, [bathrooms]);

  return (
    <Box display="flex" gap={2} flexWrap="wrap">
      {BATHROOMS.map((bathroom, i) => {
        const label = parseInt(bathroom) ? parseInt(bathroom) : bathroom;

        return (
          <Chip
            key={i}
            onClick={() => setBathrooms(bathroom)}
            label={label === 4 ? "4+" : label === "" ? "Any" : label}
            color={bathroom === bathrooms ? "primary" : "default"}
            variant="filled"
            // size="small"
            sx={{ px: 1.5 }}
          />
        );
      })}
    </Box>
  );
};

export default Bathrooms;
