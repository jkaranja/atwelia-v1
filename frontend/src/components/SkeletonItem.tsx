import { Box, Skeleton } from "@mui/material";
import React from "react";

const SkeletonItem = () => {
  return (
    <Box height={250} minWidth={300} maxWidth={500}  >
      <Skeleton variant="rounded" width="100%" height={200} />
      <Skeleton sx={{ fontSize: "1rem" }} />
      <Skeleton width="60%" />
    </Box>
  );
};

export default SkeletonItem;
