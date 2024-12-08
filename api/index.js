import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import passport from "passport";
import configurePassport from "./config/passportConfig.js";
import configPassport from "./config/passport.js";

const app = express();

// Connect DB 
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Kết nối db thành công!");
  } catch (error) {
    console.error("Kết nối db thất bại:", error);
  }
};
configurePassport(passport);
configPassport();
connectDB();

app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

// Routes
import userRouter from "./router/userRouter.js";
import culturalRouter from "./router/culturaRouter.js";
import regionRouter from "./router/regionRouter.js";
import historyRouter from "./router/historyRouter.js";
import localRouter from "./router/localRouter.js";
import imageRouter from "./router/imageRouter.js";
import favoriteRouter from "./router/favoriteRouter.js";
import postRouter from "./router/postRouter.js";

app.use("/v1/user", userRouter);
app.use("/v1/cultural", culturalRouter);
app.use("/v1/region", regionRouter);
app.use("/v1/history", historyRouter);
app.use("/v1/local", localRouter);
app.use("/v1/img",imageRouter);
app.use("/v1/favorite",favoriteRouter);
app.use("/v1/blog",postRouter);

app.listen(8800, () => {
  console.log("Kết nối server thành công!");
});
