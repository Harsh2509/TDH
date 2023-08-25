import express, { Request } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRouter from "./Routes/user";
import adminRouter from "./Routes/admin";

const app = express();
dotenv.config();

const port = process.env.PORT;
const dbURL = process.env.DB_KEY || "mongodb://127.0.0.1:27017/tdh";
mongoose
  .connect(dbURL)
  .then(() => {
    console.log("MongoDB connection established!");
    app.listen(port, () => {
      console.log(`Server started at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(`Error connecting to database: ${err}`);
  });

app.use(cors()); // To enable Cross Origin Requests
app.use(express.json()); // To easily parse body in routes.

app.use("/user", userRouter);
app.use("/admin", adminRouter);
