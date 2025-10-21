import express, { json } from "express";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import errorHandler from "./middleware/errorHandler.js";

const server = express();
const PORT = process.env.PORT;

server.use(json());
server.use(cookieParser());
server.use(
  cors({
    origin: ["*"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

server.use(errorHandler);

server.listen(PORT, async () => {
  await connectDB();
  console.log("Server is running...");
});

export default server;
