import imageCompression from "browser-image-compression";
import React from "react";

const compressImage = async (file: File) => {
  const options = {
    maxSizeMB: 1, //// (default: Number.POSITIVE_INFINITY)
    maxWidthOrHeight: 1920, //(1920 is the maximum size that each browser restricts for a browser Canvas object)
    // compressedFile will scale down by ratio to a point that width or height is smaller than maxWidthOrHeight (default: undefined).
    // but, automatically reduce the size to smaller than the maximum Canvas size supported by each browser.
    //signal: AbortSignal, // optional, to abort / cancel the compression// you can then use: const controller = new AbortController(); controller.abort(new Error('I just want to stop')); eg when it's taking too long
    useWebWorker: true,
    //onProgress: Function,         // optional, a function takes one progress argument (percentage from 0 to 100)
  };
  try {
    const compressedFile = await imageCompression(file, options);
    // console.log(
    //   "compressedFile instanceof Blob",
    //   compressedFile instanceof Blob
    // ); // true
    //console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`); // smaller than maxSizeMB
    return compressedFile;
  } catch (error) {
    //console.log(error);
    //return the uncompressed file anyway if error
    return file;
  }
};

export default compressImage;
