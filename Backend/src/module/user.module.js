import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'



const userSchema = new mongoose.Schema({

    name:{
        type:String,
        require:[true,"proidename"],

    },
    email:{
        type:String,
        require:[true,"provide email"],
        unique:true,
        
    },
    password:{
        type:String,
        require:[true,"provide password"],
    
    },
    profile_pic:{
        type:String,
        
    }
    

},{timestamps:true})

userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next()
    this.password= await bcrypt.hash(this.password,10)
    next()

})
userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password)
}
userSchema.methods.genrateAccesToken=async function(){
    return jwt.sign({
        name:this.name,
        email:this.email,
        
        _id:this._id
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    }
    )
}
userSchema.methods.genrateRefreshToken=async function(){
    return jwt.sign(
    {
        
        _id:this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    })
}




export const User=mongoose.model('User',userSchema)