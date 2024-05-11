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

function Message() {
  const params = useParams();
  const user = useSelector((state) => state.user);
  console.log(user);
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    video: "",
  });
  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];
    const uploadVideo = await uploadFile(file);
    

    setMessage(prev => {
      return {
        ...prev,
        video: uploadVideo?.url,
      };
    });
  };
  const handleUploadImage = async (e) => {
    const file = e.target.files[0];
    const uploadPhoto = await uploadFile(file);
    console.log(uploadPhoto)
    setMessage(prev => {
      return {
        ...prev,
        imageUrl: uploadPhoto?.url,
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
  console.log(userData);
  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("message-page", params.userId);

      socketConnection.on("message-user", (data) => {
        setUserData(data);
      });
    }
  }, [socketConnection, params?.userId, user]);

  return (
    <div>
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

      <section className="h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll">
        {/* upload image display*/}
        {
          console.log(message.imageUrl)
        }

        {
          message.imageUrl &&(
            <div className="w-full h-full bg-slate-700 bg-opacity-30 flex justify-center items-center overflow-hidden">
          <div className="bg-white p-3">
            <img src={message.imageUrl} alt="img" width={300} height={300} />
          </div>
            </div>
          )
        }
        
        Show all message
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
                  htmlFor="uploadImage"
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
                id="uploadImage"
                onChange={handleUploadVideo}
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Message;
