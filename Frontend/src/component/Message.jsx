import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Avtar from "../component/Avtar";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BiArrowBack } from "react-icons/bi";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { BsImage } from "react-icons/bs";
import { FaVideo } from "react-icons/fa6";
import { uploadFile } from "../helpers/uploadFiles.js";
import { ImCross } from "react-icons/im";
import backgroundImage from "../assets/Back.jpeg";
import { BsFillSendFill } from "react-icons/bs";
import moment from 'moment'







function Message() {
  const params = useParams();
  const user = useSelector((state) => state.user);
  
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    video: "",
  });
  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];
    const uploadVideo = await uploadFile(file);

    setMessage((prev) => {
      return {
        ...prev,
        video: uploadVideo?.url,
      };
    });
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    const uploadPhoto = await uploadFile(file);
    console.log(uploadPhoto);
    setMessage((prev) => {
      return {
        ...prev,
        imageUrl: uploadPhoto?.url,
      };
    });
  };
  {
    /* handlding image bar*/
  }
  const handleImageBar = () => {
    setMessage((prev) => {
      return {
        ...prev,
        imageUrl: "",
      };
    });
  };
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    profile_pic: "",
    _id: "",
    online: false,
  });
  const [openimgVideo, setOpenimgVideo] = useState(false);
  const [allmessage,setAllmessage]=useState([])
  
  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("message-page", params.userId);

      socketConnection.on("message-user", (data) => {
        setUserData(data);
      });
      socketConnection.on('message',(data)=>{
        console.log("message data",data)
        setAllmessage(data)
      })
      
      
    }
  }, [socketConnection, params?.userId, user]);
  const handleOnchange = (e) => {
    const  value  = e.target.value;

    setMessage(prev => {
      return {
        ...prev,
        text: value,
      };
    });
  };

  // sending message from here
  const HandleSubmet=(e)=>{
    e.preventDefault()
    if(message.text||message.imageUrl||message.video){
      if(socketConnection){
        socketConnection.emit('new message',{
          sender:user?._id,
          receiver:params.userId,
          text:message.text,
          imageUrl:message.imageUrl,
          video:message.video,
          msgByUserId:user?._id
      })
      }
      setMessage({
        text: "",
        imageUrl: "",
        video: "",
      })
    }


  }

  return (
    <div
      style={{ backgroundImage: `url(${backgroundImage})` }}
      className="bg-no-repeat bg-cover"
    >
      <header className="sticky top-0 h-16 bg-white flex justify-between items-center px-4">
        <div className="flex items-center gap-4 ">
          <Link to={"/"} className="lg:hidden">
            <BiArrowBack size={30} />
          </Link>
          <div>
            <Avtar
              width={60}
              hight={60}
              profile_pic={userData.profile_pic}
              name={userData?.name}
              userID={userData._id}
            />
          </div>
          <div>
            <h3 className="font-semibold text-lg my-0 text-ellipsis line-clamp-1">
              {userData?.name}
            </h3>
            <p className="my-1 text-sm">
              {userData.online ? (
                <span className="text-green-400">Online</span>
              ) : (
                <span className="text-red-400">Offline</span>
              )}
            </p>
          </div>
        </div>
        <div>
          <button className=" cursor-pointer hover:text-grey-300">
            <BsThreeDotsVertical size={30} />
          </button>
        </div>
      </header>
      {/* Show all message filed*/}

      <section className="h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll bg-slate-200 opacity-35">
        {/* upload image display*/}
        {message.imageUrl && (
          <div className="w-full h-full bg-slate-700 bg-opacity-30 flex justify-center items-center overflow-hidden relative">
            <div
              onClick={handleImageBar}
              className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-400"
            >
              <ImCross size={25} />
            </div>
            <div className="bg-white p-3">
              <img
                src={message.imageUrl}
                alt="img"
                className="aspect-video w-full h-full max-w-sm m-2"
              />
            </div>
          </div>
        )}
        
        {message.video && (
          <div className="w-full h-full bg-slate-700 bg-opacity-30 flex justify-center items-center overflow-hidden relative">
            <div
              onClick={handleImageBar}
              className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-400"
            >
              <ImCross size={25} />
            </div>
            <div className="bg-white p-3">
              <video
                src={message.video}
                className="aspect-video w-full h-full max-w-sm m-2"
                controls
                muted
                autoPlay
              />
            </div>
          </div>
        )}
        {/*All message Shows Here*/}
        <div className="flex flex-col gap-2">
          {
          allmessage.map((msg,i)=>{
            return(
              <div className={`bg-green-500 p-1 py-1 rounded w-fit ${user?.id===msg.msgByUserId ? "":'ml-auto'}`}>
                <p className="px-2">{msg.text}</p>
                <p className="text-xs ml-auto w-fit">{moment(msg.createdAt).format('hh:mm')}</p>

              </div>
            )
          })
          }
        </div>
      </section>
      {/* Send Massage filed*/}

      <section className="h-16 bg-white flex items-center px-4">
        <div className="relative">
          <button
            onClick={() => setOpenimgVideo((prev) => !prev)}
            className="relative flex justify-center items-center w-11 h-11 rounded-full hover:bg-sky-400"
          >
            <FaPlus size={30} />
          </button>
          {openimgVideo && (
            <div className="bg-white shadow rounded absolute bottom-14 w-36 p-2">
              <form>
                <label
                  htmlFor="uploadImage"
                  className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-gray-200"
                >
                  <div className="text-sky-400">
                    <BsImage size={25} />
                  </div>
                  <p>Image</p>
                </label>
                <label
                  htmlFor="uploadVideo"
                  className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-gray-200"
                >
                  <div className="text-purple-500">
                    <FaVideo size={25} />
                  </div>
                  <p>Video</p>
                </label>
              </form>
              <input
                className="hidden"
                type="file"
                id="uploadImage"
                onChange={handleUploadImage}
              />
              <input
                className="hidden"
                type="file"
                id="uploadVideo"
                onChange={handleUploadVideo}
              />
            </div>
          )}
        </div>
        {/*input box*/}

        <form className="h-full w-full flex gap-2" onSubmit={HandleSubmet}>
          <input
            type="text"
            placeholder="Enter Your Message...."
            className="py-1 px-4 outline-none w-full h-full bg-slate-300"
            value={message.text}
            onChange={handleOnchange}
          />
          <button className="text-sky-400 hover:text-green-600">
            <BsFillSendFill size={28}/>

          </button>
        </form>
      </section>
    </div>
  );
}

export default Message;
