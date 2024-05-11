import { app } from "../app.js";
import { Server } from "socket.io";
import http from "http";
import { getUserDetailsfromcookie } from "../middleware/getUserFromCookie.js";
import { User } from "../module/user.module.js";

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

  //disconnect
  socket.on("disconnect", () => {
    onlineUser.delete(user?._id);
    console.log("disconnected user", socket.id);
  });
});

export { server, app };
