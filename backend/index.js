import express from 'express'
import 'dotenv/config'
import {authenticationMiddleware} from './middlewares/auth.middleware.js'
import cors from 'cors';
import userRouter from './routes/user.routes.js'
import urlRouter from './routes/url.routes.js'

const app=express();
const PORT=process.env.PORT ?? 8000;


// // 2. Enable CORS for your frontend
// app.use(cors({
//     origin: '*', // Allows localhost during development & production domains
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   credentials: true // Cookies allow karne ke liye
// }));
// const express = require('express');
const cors = require('cors');
// const app = express();

// Whitelist Domains Define Karein
const allowedOrigins = [
  'http://localhost:3000',      // React / Next.js local dev server
  'http://localhost:5173',      // Vite local dev server
  'https://url-shortner-ruddy-two.vercel.app/' // Production frontend URL
];

const corsOptions = {
  origin: (origin, callback) => {
    // !origin Postman, Mobile Apps ya Server-to-Server requests ke liye hota hai
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow request
    } else {
      callback(new Error('Not allowed by CORS')); // Block request
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Ab credentials: true bilkul sahi kaam karega!
};

app.use(cors(corsOptions));


app.use(express.json());
app.use(authenticationMiddleware)

app.get('/',(req,res)=>{
    return res.json({status:'Server is up here'});
});

app.use(urlRouter);
app.use('/user',userRouter);


app.listen(PORT,()=>{
    console.log(`Server in on ${PORT}`);
})
