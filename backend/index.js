import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import connection from './config/connection.js';
import {rooter} from './routes/rout.js';

dotenv.config();
connection()

const app = express()
app.use(cookieParser())
app.use(express.json())
app.use('/api/v1' , rooter)
// app.post('/' , (req , res)=>{
//     console.log(req.body)
//     res.send('server is on')
// })
app.listen(process.env.PORT || 5000 , () => console.log('server is on at' , process.env.PORT))

