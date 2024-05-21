import { app } from "../app.js";
import { Server } from "socket.io";
import http from "http";
import { getUserDetailsfromcookie } from "../middleware/getUserFromCookie.js";
import { User } from "../module/user.module.js";
import { conversation } from "../module/conversation.module.js";
import { message } from "../module/message.module.js";
import { getConversation } from "../middleware/getConversation.js";

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
  

  const token = socket.handshake.auth.token;

  const user = await getUserDetailsfromcookie(token);

  //create a room
  socket.join(user?.id);
  onlineUser.add(user?._id?.toString());

  io.emit("onlineUser", Array.from(onlineUser));
  socket.on("message-page", async (userId) => {
    
    const UserDetails = await User.findById(userId).select("-password");

    const payload = {
      name: UserDetails?.name,
      _id: UserDetails?._id,
      email: UserDetails?.email,
      online: onlineUser.has(userId),
      profile_pic: UserDetails?.profile_pic,
    };
    socket.emit("message-user", payload);




    //prev msg
    const getConversationMessage = await conversation.findOne({
      $or: [
        { sender: user?._id, receiver: userId },
        { sender: userId, receiver: user?._id },
      ],
    })
      .populate('message')
      .sort({ updatedAt: -1 });

    socket.emit("message", getConversationMessage?.message || []);
  });

  

  //new message
  socket.on("new message", async (data) => {
    //cheak conversation is avilable in both user?

    let conversa = await conversation.findOne({
      $or: [
        {
          sender: data?.sender,
          receiver: data?.receiver,
        },
        {
          sender: data?.receiver,
          receiver: data?.sender,
        },
      ],
    });
    

    if (!conversa) {
      const CreateConversation = await conversation.create({
        sender: data?.sender,
        receiver: data?.receiver,
      });
      conversa = await CreateConversation.save();
    }
    const massage = await message({
      text: data.text,
      imageUrl: data.imageUrl,
      video: data.video,
      msgByUserId: data.msgByUserId,
    });
    const savemessage = await massage.save();

    const updateconversation = await conversation.updateOne(
      { _id: conversa?._id },
      {
        $push: { message: savemessage?._id },
      }
    );

    const getConversationMessage = await conversation
      .findOne({
        $or: [
          {
            sender: data?.sender,
            receiver: data?.receiver,
          },
          {
            sender: data?.receiver,
            receiver: data?.sender,
          },
        ],
      })
      .populate("message")
      .sort({ updatedAt: -1 });

    io.to(data?.sender).emit("message", getConversationMessage?.message||[]);
    io.to(data?.receiver).emit("message", getConversationMessage?.message||[]);



    ///send conversation function

    const conversationSender=await getConversation(data?.sender)
    const conversationReciver=await getConversation(data?.sender)

    io.to(data?.sender).emit("conversation", conversationSender);
    io.to(data?.receiver).emit("conversation", conversationReciver);




   
  });



  //sidebar


  socket.on('sidebar',async(curentUserID)=>{
   

    const conversationMsg= await getConversation(curentUserID)
    
    socket.emit('conversation',conversationMsg||[])

    
  })

  socket.on('seen', async(MsgbyUserId)=>{

    const seenConversation=await conversation.findOne({
      $or: [
        { sender: user?._id, receiver: MsgbyUserId },
        { sender: MsgbyUserId, receiver: user?._id },
      ],

    })
    const conversationSeenId= seenConversation?.message||[]

    const updatMessage=await message.updateMany(
      {_id:{'$in':conversationSeenId},msgByUserId : MsgbyUserId},
      {"$set":{seen:true}}
    )

    const conversationSender=await getConversation(user?._id?.toString())
    const conversationReciver=await getConversation(MsgbyUserId)

    io.to(user?._id?.toString()).emit("conversation", conversationSender);
    io.to(MsgbyUserId).emit("conversation", conversationReciver);

  })

  //disconnect
  socket.on("disconnect", () => {
    onlineUser.delete(user?._id);
    console.log("disconnected user", socket.id);
  });
});

export { server, app };
