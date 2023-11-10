const blobToFile = (blob: Blob, filename: string) => {
  return new File([blob], filename, { type: blob.type });
};


export default blobToFile