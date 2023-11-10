//for FormData interface->value must be File|Blob|string.
export interface IImage {
  // uri: string;//present in mobile //eg file:///data/user/0/com./filename.jpg //For mobile, File must contain uri, type and name
  type: string; //File
  name: string; //File
  lastModified: number; //File ////default Date.now()
  //*lastModifiedDate: Date; //File-> deprecated/could be present in file input element result in some browsers but not defined in File interface //eg Tue Nov 08 2022 20:16:47 GMT+0300 (East Africa Time)
  webkitRelativePath: string; //File
  size: number; //File + Fetched//in bytes
  // path: string; //Fetched
  //mimetype: string; //Fetched
  //destination?: string; //Fetched
  //_id: string//Fetched
  filename?: string; //Fetched
}

//-------------FileList Interface------------
//FileList interface//is an Array like object, that has the length property, and indexed values, but it lacks the Array methods, such as map. With ES6 you can use spread or Array#from to convert it to a real array.
///An object of this type is returned by the files property of the HTML <input> element
//the File object inside FileList has properties as shown above

//-----------File interface---------------
//File objects are generally retrieved from a FileList object returned as a result of a user selecting files using the <input> element, or from a drag and drop operation's DataTransfer object.2
//A File object is a specific kind of Blob, and can be used in any context that a Blob can.
//the file object inside FileList has properties as shown below(no path)

//File interface extends Blob interface // see below

// export interface File {
//   lastModified: number;//default Date.now() //File
//   name: string; // File
//   type: string; //Inherited from Blob
//   size: number //Inherited from Blob
//   webkitRelativePath: string; //File
//  *lastModifiedDate: Date;//Removed from File interface// Deprecated//could be present in actual FileList objects but not present in the File/FileList interfaces //eg Tue Nov 08 2022 20:16:47 GMT+0300 (East Africa Time)
// }

////the new File()/File instance will return the file object above

//for chat files download
export interface IFile {
  size: number; //File + Fetched//in bytes
  path: string; //Fetched
  mimetype: string; //Fetched
  destination: string; //Fetched
  _id: string; //Fetched
  filename: string; //Fetched
}
