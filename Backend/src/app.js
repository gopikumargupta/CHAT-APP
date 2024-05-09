import express from 'express'
import cookieParser from "cookie-parser";
import cors from 'cors'
const app=express()

app.use(cors({
    origin:process.env.CORS,
    Credential:true
}))


app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(cookieParser())


import Userrouter from './route/userRoute.js'

app.use("/api",Userrouter)








export {app}