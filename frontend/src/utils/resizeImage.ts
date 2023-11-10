import Resizer from "react-image-file-resizer";

interface IImageInfo {
  file: File;
  maxWidth?: number;
  maxHeight?: number;
}

const resizeImage = ({ file, maxWidth = 300, maxHeight = 500 }: IImageInfo) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file, //Required//File Object
      maxWidth, //maxWidth//Required
      maxHeight, //maxHeight//Required
      "JPEG", //Required
      100, //Required
      0, //Required
      (uri) => {
        //Required
        resolve(uri);
      },
      "base64" //not Required: default: "base64"
      //*args in this very order
      // file, // Is the file of the image which will resized.//Path of image file	object
      //   maxWidth, // Is the maxWidth of the resized new image.//New image max width (ratio is preserved)	number
      //   maxHeight, // Is the maxHeight of the resized new image.//New image max height (ratio is preserved)	number
      //   compressFormat, // Is the compressFormat of the resized new image.//Can be either JPEG, PNG or WEBP.	string
      //   quality, // Is the quality of the resized new image.//A number between 0 and 100. Used for the JPEG compression.(if no compress is needed, just set it to 100)
      //   rotation, // Is the degree of clockwise rotation to apply to uploaded image.//Degree of clockwise rotation to apply to the image. Rotation is limited to multiples of 90 degrees.(if no rotation is needed, just set it to 0) (0, 90, 180, 270, 360)
      //   responseUriFunc, // Is the callBack function of the resized new image URI.//Callback function of URI. Returns URI of resized image's base64 format. ex: uri => {console.log(uri)});
      //   outputType, // Is the output type of the resized new image.//Can be either base64, blob or file.(Default type is base64)	string
      //   minWidth, // Is the minWidth of the resized new image.//New image min width (ratio is preserved, defaults to null)	number
      //   minHeight; // Is the minHeight of the resized new image.//New image min height (ratio is preserved, defaults to null)	number
    );
  });

export default resizeImage;
