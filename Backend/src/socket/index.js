import {app} from '../app.js'
import {Server} from 'socket.io'
import http from 'http'
import { getUserDetailsfromcookie } from '../middleware/getUserFromCookie.js'


////////Socket connection////////


const server=http.createServer(app)
const io=new Server(server,{
    cors:{
        origin:process.env.CORS,
        credentials:true
    }
})
const onlineUser=new Set()

io.on('connection',async(socket)=>{
    console.log('connect User',socket.id)

    const token=socket.handshake.auth.token
    console.log(token)
    const user= await getUserDetailsfromcookie(token)

    console.log(user)

    //create a room
    socket.join(user?.id)
    onlineUser.add(user?._id)

    io.emit('onlineUser',Array.from(onlineUser))
    





    //disconnect
    socket.on('disconnect',()=>{
        onlineUser.delete(user?._id)
        console.log('disconnected user',socket.id)

    })

})


export{server,app}





