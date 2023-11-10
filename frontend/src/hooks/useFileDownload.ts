import axios from "axios";
import fileDownload from "js-file-download";
import { toast } from "react-toastify";

import useAxiosPrivate from "./useAxiosPrivate";
import { useState } from "react";
import { IFile } from "../types/file";

const useFileDownload = () => {
  const axiosPrivate = useAxiosPrivate();

  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (file: IFile) => {
    const path = encodeURIComponent(file.path);

    try {
      setIsDownloading(true);
      //axiosPrivate has already set token in header and base url
      const response = await axiosPrivate.get(
        `/api/download/single?filepath=${path}`,
        {
          //signal: controller.signal,
          responseType: "blob", //important else, file will be corrupted
        }
      );

      fileDownload(response.data, file!.filename); //creates a <a> element and triggers a click() event on

      setIsDownloading(false);
    } catch (error) {
      setIsDownloading(false);
      //since return type is blob, you won't see the 'file not found from server' error, here, message is: "Request failed with status code 400"
      if (axios.isAxiosError(error)) {
        const e =
          error.response?.data?.message || error.message || error.toString();

        //toast.error(e);
        toast.error("File not found");
      } else {
        // toast.error((error as any).toString());
        toast.error("File not found");
      }
    }
  };

  return [handleDownload, isDownloading] as const;
};

export default useFileDownload;
