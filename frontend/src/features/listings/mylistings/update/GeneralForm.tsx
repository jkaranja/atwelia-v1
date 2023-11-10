import { useEffect, useState } from "react";
import { useAppSelector } from "../../../../hooks/useAppSelector";

import { Box, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import Dropzone from "../../../../components/Dropzone";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";

import Overview from "../../../../components/Overview";
import { IImage } from "../../../../types/file";
import { addToUpdated, selectUpdatedListing } from "../listingSlice";
import { useForm, useWatch } from "react-hook-form";
import { TFactInputs } from "../../../../types/react-hook-form";

const GeneralForm = () => {
  const updated = useAppSelector(selectUpdatedListing);
  const dispatch = useAppDispatch();

  const [selectedImages, setSelectedImages] = useState<IImage[]>(
    (updated.listingImages as any) || []
  );

  //update updated in store
  useEffect(() => {
    dispatch(
      addToUpdated({
        listingImages: selectedImages,
      })
    );
  }, [selectedImages]);

  return (
    <Box>
      <Typography variant="h6">
        Add at least 3 photos
        <Typography pl={0.5} color="muted.main" component="span">
          *
        </Typography>
      </Typography>

      <Dropzone
        selectedImages={selectedImages}
        setSelectedImages={setSelectedImages}
      />
    </Box>
  );
};

export default GeneralForm;
