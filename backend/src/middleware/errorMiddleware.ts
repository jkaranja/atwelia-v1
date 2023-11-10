import { NextFunction, Request, Response } from "express";
import { logEvents } from "./loggerMiddleware";

//logging errors to our file//eg in a2 hosting, errors are only logged in development mode
//called by express next(error) to override default error handler
//don't use unknown for err below. You can't access or
const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logEvents(
    `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    "errLog.log"
  );
  //catch sync or any other errs given default status code of 200 --> set to 500
  //express sets 200  as status code if one is not set in route handlers & middleware
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  //200 is already set in res//don't use below
  //const status = res.statusCode ? res.statusCode : 500; // server error
  res.json({ message: err.message, isError: true }); //isError catches any error sent as 200//check on frontend
};

export default errorHandler;
