import 'dotenv/config'
import {app} from './app.js'
import dbConnect from './db/index.js'
import cookieParser from 'cookie-parser'
app.use(cookieParser())



dbConnect().
then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`server is running at ${process.env.PORT} `)
    })

}).
catch((e)=>console.log("ERR",e))








