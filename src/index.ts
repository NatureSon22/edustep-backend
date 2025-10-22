import express, { json } from "express";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import errorHandler from "./middleware/errorHandler.js";
import authRouter from "./routes/auth.js";
import accountRouter from "./routes/account.js";
import courseRouter from "./routes/course.js";
import roomRouter from "./routes/room.js";
import fileRouter from "./routes/file.js";
import memberRouter from "./routes/member.js";

const server = express();
const PORT = process.env.PORT;

//TODO: profile pic update

server.use(json());
server.use(cookieParser());
server.use(
  cors({
    origin: ["*"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

server.use("/api/auth", authRouter);
server.use("/api/accounts", accountRouter);
server.use("/api/courses", courseRouter);
server.use("/api/rooms", roomRouter);
server.use("/api/members", memberRouter);
server.use("/api/files", fileRouter);

server.use(errorHandler);

server.listen(PORT, async () => {
  await connectDB();
  console.log("Server is running...");
});

export default server;
