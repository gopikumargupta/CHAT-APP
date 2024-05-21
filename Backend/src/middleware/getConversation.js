import { conversation } from "../module/conversation.module.js";
const getConversation = async (curentUserID) => {
  if (curentUserID) {
    const currentUserConversation = await conversation
      .find({
        $or: [{ sender: curentUserID }, { receiver: curentUserID }],
      })
      .sort({ updatedAt: -1 })
      .populate("message")
      .populate("sender")
      .populate("receiver");

    
    const conversationMsg = currentUserConversation.map((msg) => {
      const countUnseenMsg = msg.message.reduce(
        (prev, curr) => {
          if(curr?.msgByUserId?.toString()!== curentUserID){
            return prev + (curr.seen ? 0 : 1)
          }
          else{
            return prev
          }
          },
        0
      );
      return {
        _id: msg?._id,
        sender: msg?.sender,
        receiver: msg?.receiver,
        unseenMsg: countUnseenMsg,
        lastMsg: msg.message[msg?.message?.length - 1],
      };
    });
    return conversationMsg
  }
  else{
    return []
  }
};

export {getConversation}
