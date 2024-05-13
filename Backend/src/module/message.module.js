import mongoose from 'mongoose'

const massageSchema=new  mongoose.Schema({

    text:{
        type:String,
        default:""
    },
    imageUrl:{
        type:String,
        default:""
    },
    video:{
        type:String,
        default:""
    },
    seen:{
        type:Boolean,
        default:false
    },
    msgByUserId:{
        type:mongoose.Schema.Types.ObjectId,
        require :true,
        ref:"user"
    }

},{timestamps:true})

export const  message=mongoose.model('message',massageSchema)