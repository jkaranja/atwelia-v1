//https://www.webmound.com/download-file-using-express-nodejs-server/
//https://codingmasterweb.com/index.php/2021/12/25/zip-files-using-node-express/
//https://www.tutorialswebsite.com/zip-and-download-files-using-nodejs/
//use ADM-ZIP //alt is express zip
//admin-zip can zip and save files to disk, extract zipped files
//here, we zip and set response headers to download on frontend

import AdmZip from "adm-zip";
import { RequestHandler } from "express";
import fs from "fs";
import path from "path";

interface IDownloadQuery {
  filepath: string;
}

/**
 * @desc - Download->respond with correct headers for browser to download file
 * @route - GET api/download/single/:path
 * @access - Private
 */
const singleDownload: RequestHandler<
  unknown,
  unknown,
  unknown,
  IDownloadQuery
> = (req, res) => {
  const filePath = decodeURIComponent(req.query.filepath);
  //filePath shape eg: "uploads_rev/How many times is Abraham mentioned in the Bible.edited.docx

  if (!filePath) return res.status(401).json({ message: "File not found" });

  const fullFilePath = path.resolve(__dirname, "../", "../", filePath);

  //check if file exists
  //returns null or err object //err.code='ENOENT'
  fs.stat(fullFilePath, (err, stat) => {
    if (err) return res.status(400).json({ message: "File not found" });

    //download res
    return res.download(fullFilePath); //sets content disposition & content type//res.download(filePath, customFilename)
  });
};

/**
 * @desc - Post all notes
 * @route - POST api/download/zip
 * @access - Private
 *
 */

//multiple/zip or compress using adm-zip library
const zipDownload: RequestHandler = (req, res) => {
  const { filePaths } = req.body; //an array

  if (!filePaths?.length)
    return res.status(401).json({ message: "File not found" });

  //check if  all paths are valid/files exists
  // const isValid = filePaths.some((path) => {
  //   let ENOENT = false;
  //   fs.stat(path, (err, stat) => {
  //     if (err !== null) {
  //       ENOENT = true;
  //     }
  //   });

  //   return ENOENT;
  // });

  // if (!isValid) {
  //   res.status(400).json({ message: "Files couldn't be zipped" });
  // }

  //Initializing adm-zip library
  const zip = new AdmZip();

  // add local file
  filePaths.map((path: string) => {
    zip.addLocalFile(path);
  });

  //creating zip file if there's none using fs module //Date.now() + "auth-template.zip";
  const output = "auth-template.zip";
  fs.writeFileSync(output, zip.toBuffer());

  //Downloading the compressed file
  res.download(output);

  //const zip = new AdmZip();

  // for (var i = 0; i < uploadDir.length; i++) {
  //   zip.addLocalFile(__dirname + "/upload/" + uploadDir[i]);
  // }

  // [
  //   "uploads/d1adc65b9263ce8e49d0650ed79d555f.jpg",
  //   "uploads/5d312fa493b5d70bd7a3616910835d78.jpg",
  // ].map((path) => {
  //   zip.addLocalFile(path);
  // });

  // // Define zip file name
  // const downloadName = `${Date.now()}.zip`;

  // const data = zip.toBuffer();

  // // save file zip in root directory
  // //zip.writeZip(__dirname + "/" + downloadName);

  // // code to download zip file

  // res.set("Content-Type", "application/octet-stream");
  // res.set("Content-Disposition", `attachment; filename=${downloadName}`);
  // res.set("Content-Length", data.length);
  // res.send(data);
  // res.header("Access-Control-Allow-Origin", "*");
};

export { singleDownload, zipDownload };
