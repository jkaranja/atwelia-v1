//use this**//https://dev.to/franciscomendes10866/image-upload-to-cloudinary-with-node-js-523o
//https://medium.com/@joeeasy_/uploading-images-to-cloudinary-using-multer-and-expressjs-f0b9a4e14c54
//https://blog.bitsrc.io/api-upload-file-to-cloudinary-with-node-js-a16da3e747f7
//use this instead of multer-storage-cloudnary: https: medium.com/codex/how-to-upload-images-to-cloudinary-using-nestjs-9f496460e8d7
// https://support.cloudinary.com/hc/en-us/community/posts/360007581379-Correct-way-of-uploading-from-buffer-
// https://medium.com/codex/how-to-upload-images-to-cloudinary-using-nestjs-9f496460e8d7
import {
  v2 as cloudinary
} from "cloudinary";

import { CloudinaryStorage } from "multer-storage-cloudinary";

import multer from "multer";

import streamifier from "streamifier";

//global configs

//NOTE//a/c --> github

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
});

//upload option 1://working upload as a stream//buffer created by multer, have multer process multipart bt don't supply storage(won't save to disk)
//we then use streamifier to turn the buffer into a readable stream
//use it as a normal async function
export const uploadPic = async (file: Express.Multer.File) => {
  //use a promise instead of cb//easier to work with//below promise will settle with result or err
  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      {
        folder: "AUTH",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result!);
      }
    );
    streamifier.createReadStream(file.buffer).pipe(upload);
  });
};
//above without a promise:
//works with callback
//  let cld_upload_stream = cloudinary.uploader.upload_stream(
//    { folder: "foo", },
//    function (error, result) {
//      console.log(error, result);
//    }
//  );
//  streamifier.createReadStream(req.file.buffer).pipe(cld_upload_stream);

/** ------------------DELETE IMAGE- working--------------////use it as a normal async function */
export const removeImage = async (publicId: string | undefined) => {
  try {
    if (!publicId) return;
    // Upload the image
    const result = await cloudinary.uploader.destroy(publicId);
    // console.log(result);
    return result;
  } catch (error) {
    return null;
    // console.error(error);
  }
};

//------------------------------------------------------------
//OTHER UPLOAD OPTIONS & URL GEN FROM PUBLIC ID //NOT USED
//---------------------------------------------------------------

//upload option 2: //working////use it as normal multer upload/middleware
//using multer-storage-cloudinary to upload files to cloudinary using multer sent with form data
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,

  params: {
    folder: "AUTH", //or add  folder: string; under type with public_id?//in index.d.ts//multer-storage-cloudinary //lib
    public_id: (req: any, file: any) => {
      const filenameArr = file?.originalname?.split(".");
      filenameArr.pop();
      return new Date().toISOString().replace(/[:.]/g, "-") + "-" + filenameArr;
    },
  } as any,
});
export const upload = multer({ storage }); //use it as normal multer upload/middleware = .patch(upload.single("profilePic"), userController.updateUser)

//upload option 3:  //use it as a normal async function
//uploads if you already have a file path//not sent in file from browser for sec reasons//N/A
//can use it with base64 string from FileReader or URL.createObjectURL string sent from frontend
//not good as base64 format increases data size since it can't be streamed in chunks
export const uploadImage = async (imagePath: string) => {
  const options = {
    folder: "auth",
    width: 250,
    height: 250,
    // use_filename: true, //use filename as public id
    //   unique_filename: false,
    //   overwrite: true,
  };

  try {
    if (!imagePath) return null;
    // Upload the image
    const result = await cloudinary.uploader.upload(imagePath, options);
    console.log(result);
    return result.public_id;
  } catch (error) {
    console.error(error);
    return null;
  }
};

//upload option 4: working //upload from client-rest api to cloudinary//see graphql project//under settings/cloudinary

//cloudinary upload response:
// {
// [1]   asset_id: 'ba0f977b4bfb63d702301e7ea2e033c7',
// [1]   public_id: 'AUTH/jzwmalbgdobk9t86ijms',
// [1]   version: 1680700992,
// [1]   version_id: '2dddabf111aae39dca2f18b633ce247a',
// [1]   signature: 'b903d5d9ff8cb7929dc20e33dbb573b3dd26a065',
// [1]   width: 2000,
// [1]   height: 1333,
// [1]   format: 'jpg',
// [1]   resource_type: 'image',
// [1]   created_at: '2023-04-05T13:23:12Z',
// [1]   tags: [],
// [1]   bytes: 349015,
// [1]   type: 'upload',
// [1]   etag: '8e3d1c491d2086867d6168be5317df3c',
// [1]   placeholder: false,
// [1]   url: 'http://res.cloudinary.com/da4urrvxa/image/upload/v1680700992/AUTH/jzwmalbgdobk9t86ijms.jpg',
// [1]   secure_url: 'https://res.cloudinary.com/da4urrvxa/image/upload/v1680700992/AUTH/jzwmalbgdobk9t86ijms.jpg',
// [1]   folder: 'AUTH',
// [1]   access_mode: 'public',
// [1]   original_filename: 'file',
// [1]   api_key: '326185274191244'
// [1] }

/**----------------------FETCH IMAGE & TRANSFORM IT---------------------------------- */
//takes the id, fetches the image and transform it before it is displayed
export const createImageUrl = (publicId: string | undefined) => {
  if (!publicId) return;
  // Creates an HTML image tag/url instead with a transformation that
  // results in a circular thumbnail crop of the image
  // focused on the faces
  // transformations applied to the URL
  //eg Output: "https://res.cloudinary.com/demo/image/upload/w_100,h_150,c_fill/sample.jpg"
  const imageUrl = cloudinary.url(publicId, {
    transformation: [
      {
        width: 250,
        height: 250,
        gravity: "faces",
        crop: "thumb",
      },

      { radius: "max" },
      { effect: "outline:10" },
    ],
  });

  // let imageTag = cloudinary.image("sample.jpg") would output a html img tag:
  //eg //<img src="https://res.cloudinary.com/demo/image/upload/c_fill,h_500,w_500/v1573726751/docs/casual" alt="Casual Jacket">
  //so you just add it in react as {imageTag}//can't be used in avatar

  return imageUrl;
};
