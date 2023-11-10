/**
 *
 * @param files - Raw File[]: req.files
 * @returns  - Clean File[]
 */

interface MulterFile extends Express.Multer.File {}

interface MulterMultipleFiles extends Record<string, Express.Multer.File[]> {}

const cleanFiles = (files: MulterFile[] | MulterMultipleFiles) => {
  if (Array.isArray(files)) {
    return files?.map((file) => ({
      path: `${file.destination}/${file.filename}`,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
    }));
  }
  return [];
};

export default cleanFiles;
