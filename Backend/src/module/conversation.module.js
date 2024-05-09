import mongoose from 'mongoose'



const conversationSchema= new mongoose.Schema({

    sender:{
        type:mongoose.Schema.Types.ObjectId,
        require :true,
        ref:"user"
        
    },
    receiver:{
        
        type:mongoose.Schema.Types.ObjectId,
        require :true,
        ref:"user"
        
    },
    message:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'message'
        }
    ]


},{timestamps:true})

export const conversation=mongoose.model('conversation',conversationSchema)