import { app } from "../app.js";
import { Server } from "socket.io";
import http from "http";
import { getUserDetailsfromcookie } from "../middleware/getUserFromCookie.js";
import { User } from "../module/user.module.js";
import {conversation} from '../module/conversation.module.js'
import {message} from '../module/message.module.js'

////////Socket connection////////

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CORS,
    credentials: true,
  },
});
const onlineUser = new Set();

io.on("connection", async (socket) => {
  console.log("connect User", socket.id);

  const token = socket.handshake.auth.token;

  const user = await getUserDetailsfromcookie(token);

  //create a room
  socket.join(user?.id);
  onlineUser.add(user?._id?.toString());

  io.emit("onlineUser", Array.from(onlineUser));
  socket.on("message-page", async (userId) => {
    console.log("user_id", userId);
    const UserDetails = await User.findById(userId).select("-password");

    const payload = {
      name: UserDetails?.name,
      _id: UserDetails?._id,
      email: UserDetails?.email,
      online: onlineUser.has(userId),
      profile_pic:UserDetails?.profile_pic
    };
    socket.emit("message-user", payload);
  });

  //new message
  socket.on('new message',async(data)=>{
    //cheak conversation is avilable in both user?

    let conversa = await conversation.findOne({
      "$or":[
        {
          sender:data?.sender,
          receiver:data?.receiver
        },
        {
          sender:data?.receiver,
          receiver:data?.sender
        }
      ]
    })
    console.log("con1",conversa)

    if(!conversa){
      const CreateConversation=await conversation.create({
        sender:data?.sender,
        receiver:data?.receiver


      })
      conversa= await CreateConversation.save()

    }
    const massage =await message({
          
          text:data.text,
          imageUrl:data.imageUrl,
          video:data.video,
          msgByUserId:data.msgByUserId
    })
    const savemessage= await massage.save()

    const updateconversation= await conversation.updateOne({_id:conversa?._id},{
      "$push":{message:savemessage?._id}
    })

    const getConversationMessage=await conversation.findOne({
      "$or":[
        {
          sender:data?.sender,
          receiver:data?.receiver
        },
        {
          sender:data?.receiver,
          receiver:data?.sender
        }
      ]

    }).populate('message').sort({updatedAt:-1})

    io.to(data?.sender).emit('message',getConversationMessage.message)
    io.to(data?.receiver).emit('message',getConversationMessage.message)

    console.log("get conversation",getConversationMessage)
    
    

  })

  //disconnect
  socket.on("disconnect", () => {
    onlineUser.delete(user?._id);
    console.log("disconnected user", socket.id);
  });
});

export { server, app };
