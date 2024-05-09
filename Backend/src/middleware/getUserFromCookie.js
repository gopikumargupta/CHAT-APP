import  jwt  from "jsonwebtoken"
import { User } from "../module/user.module.js"
 export const getUserDetailsfromcookie=async(token)=>{
    

    if(!token){
        return {
            message:"session out",
            logout:true
        }
    }
    const decode=await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    const user =await User.findById(decode.id).select("-password")

    return user


}