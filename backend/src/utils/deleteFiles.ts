import fs from "fs";
import path from "path";
import { IImage } from "../types/listing";

const deleteFiles = (files: IImage[]) => {
  //catch any file system errors
  try {
    if (!files?.length) return null;

    files.forEach((file) => {
      const fullFilePath = path.resolve(__dirname, "../", "../", file.path);

      fs.unlinkSync(fullFilePath);
    });

    return "deleted";
  } catch (e) {
    return null;
  }
};

export default deleteFiles;
