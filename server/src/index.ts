import express from 'express';
import { Request, Response } from 'express';
import { configureRoutes } from './routes';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
import passport from 'passport';
import { configurePassport } from './local-passport';
import mongoose from 'mongoose';
import cors from 'cors';

const app=express();
const port=5000;
const dataBaseUrl="mongodb://localhost:27017/kerdo_db";
const clientUrl="http://localhost:4200"

mongoose.connect(dataBaseUrl).then((data)=>{
    console.log("Connected to mongodb.");
}).catch((error)=>{
    console.error(error);
    return;
});

const corsOptiopns={
    origin: (o: string|undefined, callback: (err: Error|null, allowed: boolean)=>void)=>{
        if(o===clientUrl){
            callback(null, true);
            return;
        }
        callback(new Error("You shall not pass!"), false);
    },
    credentials: true
};
app.use(cors(corsOptiopns));

app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser());

const sessionOptions: expressSession.SessionOptions={
    secret: "secret$Batida",
    resave: false,
    saveUninitialized: false
};
app.use(expressSession(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());

configurePassport(passport);

app.use(configureRoutes(passport, express.Router()));

app.listen(port, ()=>{
    console.log("A szerver elindult.");
});