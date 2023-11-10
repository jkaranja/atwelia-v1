import { Box, IconButton, Typography, CircularProgress } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import FilePresentOutlinedIcon from "@mui/icons-material/FilePresentOutlined";
import convertBytesToKB from "../common/convertBytesToKB";
import useFileDownload from "../hooks/useFileDownload";
import { IFile } from "../types/file";


type DownloadProps = {
  file: IFile;
};

const Download = ({ file }: DownloadProps) => {
  const [handleDownload, isDownloading] = useFileDownload();

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      border={1}
      borderColor="dull.light"
      mb={1}
      px={0.5}
    >
      <IconButton
        onClick={() => handleDownload(file)}
        size="small"
        color="secondary"
      >
        <FilePresentOutlinedIcon />
      </IconButton>

      <Typography
        component="span"
        color="secondary.main"
        onClick={() => handleDownload(file)}
        sx={{ cursor: "pointer" }}
        variant="body2"
      >
        {/* slice 4 character back to exclude dot + file extension(4 characters max) eg if length = 41, slicing upto 40 will include .doc, only x is removed   */}
        {file.filename.length > 40
          ? `${file.filename.slice(0, 36).trim()}...${file?.filename
              ?.split(".")
              .pop()}`
          : file.filename}
      </Typography>
      <Typography component="span" color="muted.dark" variant="body2">
        {/* {convertBytesToKB(file.size)} kb */}
      </Typography>
      <IconButton
        color="secondary"
        onClick={() => handleDownload(file)}
        size="small"
      >
        {isDownloading ? (
          <CircularProgress size={20} color="inherit" />
        ) : (
          <DownloadIcon />
        )}
      </IconButton>
    </Box>
  );
};

export default Download;
