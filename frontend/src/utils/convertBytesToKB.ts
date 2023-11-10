
  /* -------------------------------
/BYTES TO KILOBYTES FOR PREVIEW
---------------------------------*/


const KILO_BYTES_PER_BYTE = 1000;


const convertBytesToKB = (bytes: number) =>
  Math.round(bytes / KILO_BYTES_PER_BYTE);

  export default convertBytesToKB;
