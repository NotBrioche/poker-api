import app from "./app";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

const mongoDB = "mongodb://127.0.0.1:27017/pokerstore";

mongoose
  .connect(mongoDB, {
    authSource: "admin",
    pass: "example",
    user: "root",
  })
  .then(() => {
    console.log("Connected to MongoDB");

    app.listen(3000, () => {
      console.log("Server running on : http://localhost:3000");
    });
  });
