import express from "express";
import { PORT, mongoDBURL } from "./configure.js";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();
import passport from "passport";
import jwt from "jsonwebtoken";
import userRoutes from "./routes/users.js";

const app = express();

//middleware config
app.use(cors());
app.use(bodyParser.urlencoded({extended: true, limit: '20mb'}));
app.use(bodyParser.json({ limit: '20mb' }));

app.use('/api/users', userRoutes);

mongoose.
    connect(mongoDBURL)
    .then(() => {
        console.log('App connected to database');
        app.listen(PORT, () => {
            console.log(`Listening on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(error);
    });


