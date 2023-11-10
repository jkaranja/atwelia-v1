import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { Box, Button, Divider, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { IImage } from "../types/file";
import blobToFile from "../utils/blobToFile";
import compressImage from "../utils/compressImage";
import ImagesPreview from "./ImagesPreview";

//https://react-dropzone.js.org/
//https://blog.openreplay.com/create-a-drag-and-drop-zone-in-react-with-react-dropzone
//https://www.bezkoder.com/drag-drop-file-upload-react-hooks/

interface DropzoneProps {
  selectedImages: IImage[];
  setSelectedImages: React.Dispatch<React.SetStateAction<IImage[]>>;
}

const Dropzone = ({ selectedImages, setSelectedImages }: DropzoneProps) => {
  const [isLoading, setIsLoading] = useState(false);

  /* -----------------------------------------------------
/ON DROP /AFTER FILES ARE DROPPED OR SELECTED WITH OPEN
---------------------------------------------------------*/
  //use acceptedFiles instead//not updating state correctly cause of use call back//replacing instead of adding
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // if (acceptedFiles.length > 0) {
    //   setSelectedFiles([...selectedFiles, ...acceptedFiles]);
    // }
  }, []);

  /* ----------------------
   /useDropzone HOOK
-------------------------*/
  //use useDropzone({noClick: true, noKeyboard: true) to prevent opening two dialogs when using label as a root Box and
  //when using a button with onClick ={open} upload btn inside the root Box
  //either use the btn outside or have it inside and disable click on button on roo Box
  //when you click a btn inside of it
  //the hook also support onDragLeave, onDragOver, onDragEnter, onError, isDragAccept,
  // isDragReject, isFocused,isDragActive=true on area/false out of area
  //for options inside ({//accept: /'image/*' or {image: 'image/*'}, multiple=true default , maxFiles:2})
  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragActive,
    isDragAccept,
    isDragReject,
    open, //open normal file selector and adds files to acceptedFiles
    acceptedFiles,
  } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
    //maxFiles: 2,
    accept: {
      "image/*": [],
    },
  });
  //can also get files like this// use this instead of onDrop //not updating state correctly
  //   const files = acceptedFiles.map((file) => (
  //     <li key={file.path}>{file.path}</li>
  //   ));

  /* --------------------------------------------------------------
   /UPDATE STATE// MUST BE INSIDE USE EFFECT OW INFINITE RENDER
-------------------------------------------------------------------*/
  useEffect(() => {
    if (acceptedFiles.length > 0) {
      //ignore files that are already added
      const newFiles = acceptedFiles.filter(
        (file) =>
          !selectedImages
            .map((selectedFile) => selectedFile.name)
            .includes(file.name)
      );

      if (!newFiles.length) return; //nothing to do

      setIsLoading(true);
      //compress files & update list
      const compress = async () => {
        const compressedImages: IImage[] = await Promise.all(
          newFiles.map(async (img) => {
            //compressImage below returns a Blob/it will be uploaded normally but the file will not show properly and no thumbnail(type: File instead of jpeg etc)
            //must convert blob to file
            return blobToFile(await compressImage(img), img.name);
          })
        );

        //update selected files list
        setSelectedImages((prev) => [...prev, ...compressedImages]);
        setIsLoading(false);
      };

      compress();
    }
  }, [acceptedFiles]);

  return (
    <Box className="dropzone-wrapper">
      {/* getRootProps can be applied to an element//PASS CLASS/ID AS BELOW */}
      <Box
        sx={{ borderColor: isDragActive ? "secondary.light" : undefined }}
        {...getRootProps({
          className: `dropzone`,
        })}
        borderRadius={1}
      >
        {/* getInputProps must be applied to an input only */}
        <input accept="image/*" className="input-zone" {...getInputProps()} />

        <Box>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <CloudUploadOutlinedIcon sx={{ fontSize: 45 }} />
            {isDragActive ? (
              <Typography className="dropzone-content">
                Release to drop the photos here
              </Typography>
            ) : (
              <Typography className="dropzone-content">
                Drag and drop photos here
              </Typography>
            )}
            <Divider sx={{ width: "20%", my: 1 }}>or</Divider>
            <Button color="secondary" onClick={open} variant="outlined">
              browse
            </Button>
          </Box>
        </Box>
      </Box>
      <Box pt={3}>
        <Box pb={2}>
          <Typography variant="body2" color="muted.main">
            The first picture will be the featured image. Grab and drag pictures
            to reorder.
          </Typography>
        </Box>
        <ImagesPreview
          setSelectedImages={setSelectedImages}
          selectedImages={selectedImages}
          acceptedFiles={acceptedFiles}
          isLoading={isLoading}
        />
      </Box>
    </Box>
  );
};

export default Dropzone;
