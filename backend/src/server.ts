import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import "express-async-errors";
import mongoose from "mongoose";
import path from "path";
import corsOptions from "./config/corsOptions";
import connectDB from "./config/dbConn";
import errorHandler from "./middleware/errorMiddleware";
import { logEvents } from "./middleware/loggerMiddleware";
import authRoutes from "./routes/authRoutes";
import chatRoutes from "./routes/chatRoutes";
import contactRoutes from "./routes/contactRoutes";
import listingRoutes from "./routes/listingRoutes";
import downloadRoutes from "./routes/downloadRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import tourRoutes from "./routes/tourRoutes";

import paymentRoutes from "./routes/paymentRoutes";
import userRoutes from "./routes/userRoutes";
//import "./utils/scheduleTasks";

//load & run passport middleware(initialize + strategies) for Oauth2/SSO
//import "./config/passport";

const app = express();

const PORT = process.env.PORT || 4000; //avoid 5000//used by other services eg linkedin passport
connectDB();

//log req events
//app.use(logger);
//parse data/cookie
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/* Parse cookie header and populate req.cookies */
app.use(cookieParser());
//allow cross origin requests//other origins to req our api//leave black to allow all
//corsOptions= {
//   origin: ["http://localhost:3050"], //can be an array or function for dynamic origins like below
//   credentials: true, //allow setting of cookies etc
//  optionsSuccessStatus: 200;
// }
//if no origin configured, it allows all origins
app.use(cors(corsOptions));

/*-----------------------------------------
 * ROUTES
 ----------------------------------------*/
app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/listings", listingRoutes);

app.use("/api/chats", chatRoutes);


 app.use("/api/payments", paymentRoutes);

// app.use("/api/billing", billingRoutes);

// app.use("/api/reports", reportRoutes);

app.use("/api/tours", tourRoutes);

app.use("/api/notifications", notificationRoutes);

app.use("/api/download", downloadRoutes);

app.use("/api/contact", contactRoutes);

/*-----------------------------------------
 * SERVE FRONTEND
 ---------------------------*-------------*/
//must be the last route to match any route not matched above
if (process.env.NODE_ENV === "production") {
  //Express looks up the files relative to the static/root directory(files directory eg .static('public or uploads/images')), so the name of the static directory is not part of the URL.
  //can add virtual path prefix(where the path does not actually exist in the file system)-> .com/static/xyz.jpeg
  app.use("/static", express.static(path.join(__dirname, "../uploads/images"))); //path = atwelia.com/static/xyz.jpeg
  app.use(
    "/profile",
    express.static(path.join(__dirname, "../uploads/profile"))
  );

  //serve frontend
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  //send html page/match any path given that doesn't match any of my routes above * //
  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "../", "frontend", "dist", "index.html")
    );
  });
} else {
  //serve static files in public folder
  app.use(express.static(path.join(__dirname, "public")));
  //show->Under maintenance page
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
  });
}

/*-----------------------------------------
 * ERROR HANDLER//MUST BE THE LAST MIDDLEWARE
 ---------------------------*-------------*/
app.use(errorHandler);

/*-----------------------------------------
 * RUN SERVER AND OPEN CONNECTION TO DB
 ---------------------------*-------------*/
//run server only when db is connected
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  //pass express instance(with our routes) to http server
  //const httpServer = createServer(app);

  /*----------------------------------
 HANDLE CHAT
------------------------------------*/
  //use same server with our websocket connection
  // const io = new Server(httpServer, {
  //   cors: corsOptions,
  // });

  // //create connection
  // io.on("connection", (socket) => {
  //   //socket.id//unique id given to every user connected///socket.on(eventName, listener)
  //   /*---------------------------------------------------
  //   ROOM --> CLIENT <-> WRITER
  // ---------------------------------------------------*/
  //   //set online when joined
  //   socket.on("join room", (room) => {
  //     socket.join(room);
  //     socket.to(room).emit("joined room", room);
  //     console.log(`user id: ${socket.id}, joined room id: ${room}`);
  //   });

  //   //welcome new user i.e have them add you to their onlineList
  //   socket.on("welcome", (room) => {
  //     socket.to(room).emit("welcomed", room);
  //     //console.log(`user id: ${socket.id}, welcomed you to room id: ${room}`);
  //   });

  //   socket.on("leave room", (room) => {
  //     socket.leave(room);
  //     socket.to(room).emit("left room", room);
  //     console.log(`user id: ${socket.id}, left room id: ${room}`);
  //   });

  //   socket.on("new message", (room) => {
  //     socket.to(room).emit("message received", room);
  //     // console.log(`user id: ${socket.id}, posted message to room id: ${room}`);
  //   });

  //   socket.on("delete message", (room) => {
  //     socket.to(room).emit("message deleted", room);
  //     // console.log(`user id: ${socket.id}, del message from room id: ${room}`);
  //   });

  //   socket.on("typing", (room) => {
  //     socket.to(room).emit("typing");
  //     //console.log(`user id: ${socket.id}, is typing to room id: ${room}`);
  //   });

  //   socket.on("stopped typing", (room) => {
  //     socket.to(room).emit("stopped typing");
  //     //console.log(`user id: ${socket.id}, stopped typing to room id: ${room}`);
  //   });
  // });

  // //note: app.listen(3000) will not work here, as it creates a new HTTP server.
  // httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
//log db connection errors
mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});
