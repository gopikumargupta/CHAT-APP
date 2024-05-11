import 'dotenv/config'
import {app} from './app.js'
import dbConnect from './db/index.js'
import { server } from './socket/index.js'





dbConnect().
then(()=>{
    server.listen(process.env.PORT,()=>{
        console.log(`server is running at ${process.env.PORT} `)
    })

}).
catch((e)=>console.log("ERR",e))








