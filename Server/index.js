import express, { json } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from 'cookie-parser';
import userrouter from "./Routes/userRoute.js";
import taskrouter from "./Routes/tasksRoute.js"
import projectrouter from "./Routes/projectRoute.js"

dotenv.config();

const taskapp = express();

taskapp.use(json());
taskapp.use(cookieParser());
taskapp.use('/', userrouter);
taskapp.use('/', taskrouter);
taskapp.use('/', projectrouter);

const port = process.env.PORT;
const url = process.env.MONGO_URL

taskapp.listen(port, () => {
   
    console.log(`Server is listening to port: ${port}`);
    
})

mongoose.connect(url)
.then(() => {
    console.log("Connected to Mongo DB successfully");   
})
.catch((err) => {
    console.log("Unabe to connect to DB");
})


