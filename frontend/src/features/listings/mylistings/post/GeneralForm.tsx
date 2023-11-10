import React, { useEffect, useState } from "react";
import { addToDraft, selectDraftListing } from "../listingSlice";
import { useAppSelector } from "../../../../hooks/useAppSelector";
import { IImage } from "../../../../types/file";
import { useAppDispatch } from "../../../../hooks/useAppDispatch";
import { Box, Typography, FormLabel } from "@mui/material";
import Dropzone from "../../../../components/Dropzone";

import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import Overview from "../../../../components/Overview";
import { useForm, useWatch } from "react-hook-form";
import { TFactInputs } from "../../../../types/react-hook-form";

const GeneralForm = () => {
  const draft = useAppSelector(selectDraftListing);
  const dispatch = useAppDispatch();
  const [selectedImages, setSelectedImages] = useState<IImage[]>(
    (draft.listingImages as any) || []
  );

  //r-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, submitCount },
    reset: resetForm,
    control,
    watch,
    getValues,
    setValue,
  } = useForm<TFactInputs>({
    defaultValues: {
      overview: draft.overview || "",
    },
  });

  const formValues = useWatch({ control }); //all fields//use name: "field"| ["field1"]

  //update updated in store
  useEffect(() => {
    dispatch(
      addToDraft({
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
