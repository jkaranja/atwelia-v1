"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const corsOptions_1 = __importDefault(require("./config/corsOptions"));
const dbConn_1 = __importDefault(require("./config/dbConn"));
const errorMiddleware_1 = __importDefault(require("./middleware/errorMiddleware"));
const loggerMiddleware_1 = require("./middleware/loggerMiddleware");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const contactRoutes_1 = __importDefault(require("./routes/contactRoutes"));
const listingRoutes_1 = __importDefault(require("./routes/listingRoutes"));
const downloadRoutes_1 = __importDefault(require("./routes/downloadRoutes"));
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
const tourRoutes_1 = __importDefault(require("./routes/tourRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
//import "./utils/scheduleTasks";
//load & run passport middleware(initialize + strategies) for Oauth2/SSO
//import "./config/passport";
const app = (0, express_1.default)();
const PORT = process.env.PORT || 4000; //avoid 5000//used by other services eg linkedin passport
(0, dbConn_1.default)();
//log req events
//app.use(logger);
//parse data/cookie
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
/* Parse cookie header and populate req.cookies */
app.use((0, cookie_parser_1.default)());
//allow cross origin requests//other origins to req our api//leave black to allow all
//corsOptions= {
//   origin: ["http://localhost:3050"], //can be an array or function for dynamic origins like below
//   credentials: true, //allow setting of cookies etc
//  optionsSuccessStatus: 200;
// }
//if no origin configured, it allows all origins
app.use((0, cors_1.default)(corsOptions_1.default));
/*-----------------------------------------
 * ROUTES
 ----------------------------------------*/
app.use("/api/auth", authRoutes_1.default);
app.use("/api/users", userRoutes_1.default);
app.use("/api/listings", listingRoutes_1.default);
app.use("/api/chats", chatRoutes_1.default);
app.use("/api/payments", paymentRoutes_1.default);
// app.use("/api/billing", billingRoutes);
// app.use("/api/reports", reportRoutes);
app.use("/api/tours", tourRoutes_1.default);
app.use("/api/notifications", notificationRoutes_1.default);
app.use("/api/download", downloadRoutes_1.default);
app.use("/api/contact", contactRoutes_1.default);
/*-----------------------------------------
 * SERVE FRONTEND
 ---------------------------*-------------*/
//must be the last route to match any route not matched above
if (process.env.NODE_ENV === "production") {
    //Express looks up the files relative to the static/root directory(files directory eg .static('public or uploads/images')), so the name of the static directory is not part of the URL.
    //can add virtual path prefix(where the path does not actually exist in the file system)-> .com/static/xyz.jpeg
    app.use("/static", express_1.default.static(path_1.default.join(__dirname, "../uploads/images"))); //path = atwelia.com/static/xyz.jpeg
    app.use("/profile", express_1.default.static(path_1.default.join(__dirname, "../uploads/profile")));
    //serve frontend
    app.use(express_1.default.static(path_1.default.join(__dirname, "../frontend/dist")));
    //send html page/match any path given that doesn't match any of my routes above * //
    app.get("*", (req, res) => {
        res.sendFile(path_1.default.resolve(__dirname, "../", "frontend", "dist", "index.html"));
    });
}
else {
    //serve static files in public folder
    app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
    //show->Under maintenance page
    app.get("*", (req, res) => {
        res.sendFile(path_1.default.join(__dirname, "views", "index.html"));
    });
}
/*-----------------------------------------
 * ERROR HANDLER//MUST BE THE LAST MIDDLEWARE
 ---------------------------*-------------*/
app.use(errorMiddleware_1.default);
/*-----------------------------------------
 * RUN SERVER AND OPEN CONNECTION TO DB
 ---------------------------*-------------*/
//run server only when db is connected
mongoose_1.default.connection.once("open", () => {
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
mongoose_1.default.connection.on("error", (err) => {
    console.log(err);
    (0, loggerMiddleware_1.logEvents)(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, "mongoErrLog.log");
});
