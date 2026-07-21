import express from 'express'
import 'dotenv/config'
import {authenticationMiddleware} from './middlewares/auth.middleware.js'
import cors from 'cors';
import userRouter from './routes/user.routes.js'
import urlRouter from './routes/url.routes.js'

const app=express();
const PORT=process.env.PORT ?? 8000;


// 2. Enable CORS for your frontend
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));


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