import mongoose from 'mongoose'
import { DB_NAME } from '../constant.js'

const dbConnect=async()=>{
    try {
        const connection= await mongoose.connect(`${process.env.DB_URL}/${DB_NAME}`)
        console.log("DB Connected succesfully!!!",connection.connection.host)
        
    } catch (error) {
        console.log("ERR",error)
        process.exit(1)
        
    }
}
export default dbConnect