import React, { useEffect, useState } from "react";
import { MdOutlineChat } from "react-icons/md";
import { FaUserPlus } from "react-icons/fa6";
import { NavLink, useNavigate } from "react-router-dom";
import { RiLogoutBoxLine } from "react-icons/ri";
import Avtar from "./Avtar";
import { useDispatch, useSelector } from "react-redux";
import EditUserDetail from "./EditUserDetail";
import Divider from "./Divider";
import { GoArrowUpLeft } from "react-icons/go";
import SerchUser from "./SerchUser";
import { BsImage } from "react-icons/bs";
import { FaVideo } from "react-icons/fa6";
import { logout } from "../Redux/UserSlice";

function Sidebar() {
  const user = useSelector((state) => state?.user);
  const [editUserOpen, seteditUserOpen] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const [openSerchUser, setOpenSerchUser] = useState(false);
  const SocketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );
  const dispatch=useDispatch()
  const navigate =useNavigate()

  useEffect(() => {
    if (SocketConnection) {
      SocketConnection.emit("sidebar", user?._id);

      SocketConnection.on("conversation", (data) => {
        console.log("sideeeeee", data);
        const formetConversation = data.map((users, index) => {
          if (users?.sender?._id === user?.receiver?.id) {
            return {
              ...users,
              userDetails: users.sender,
            };
          } else if (users?.receiver?._id !== user?._id) {
            return {
              ...users,
              userDetails: users.receiver,
            };
          } else {
            return {
              ...users,
              userDetails: users.sender,
            };
          }
        });
        
        setAllUser(formetConversation);
        
      });
    }
  }, [SocketConnection, user]);

  const HandleLogout =()=>{
    console.log("hello")
    dispatch(logout())
    navigate('/email')
    localStorage.clear()
    
  }
  return (
    <div className="h-full w-full grid grid-cols-[48px,1fr] bg-white">
      <div className="bg-slate-200 w-12 h-full rounded-tr-md rounded-br-md text-slate-700 flex flex-col justify-between">
        <div>
          <NavLink
            className={({ isActive }) =>
              `w-12 h-12 bg-red-400 flex justify-center items-center cursor-pointer hover:bg-slate-200 mb-1 ${
                isActive && "bg-slate-200"
              }`
            }
            title="chat"
          >
            <MdOutlineChat size={25} />
          </NavLink>
          <div
            onClick={() => setOpenSerchUser(true)}
            className="w-12 h-12 bg-red-400 flex justify-center items-center cursor-pointer hover:bg-slate-200 "
            title="Add Friend"
          >
            <FaUserPlus size={25} />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <button
            className="mx-auto gap-1"
            title={user.name}
            onClick={() => seteditUserOpen(true)}
          >
            <Avtar
              width={42}
              hight={42}
              name={user.name}
              profile_pic={user?.profile_pic}
              userID={user?._id}
            />
          </button>
          <button
            title="LogOut"
            className="w-12 h-12 bg-red-400 flex justify-center items-center cursor-pointer hover:bg-slate-200 mt-1" onClick={HandleLogout}
          >
            <span className="-ml-2">
              <RiLogoutBoxLine size={25} />
            </span>
          </button>
        </div>
      </div>
      <div className="w-full">
        <div className="h-16 flex items-center ">
          <h2 className="text-2xl font-bold p-3 text-slate-700 h-16">
            Message
          </h2>
        </div>
        <div className="bg-slate-200 p-[0.5px]"></div>

        <div className="h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto">
          {allUser.length === 0 && (
            <div className="mt-12">
              <div className="flex justify-center items-center my-5 text-slate-500">
                <GoArrowUpLeft size={100} />
              </div>
              <p className="text-lg text-center text-slate-400">
                Explore User To Start A Conversation.
              </p>
            </div>
          )}

          {allUser.map((conv, index) => {
            return (
              <NavLink to={'/'+conv.userDetails._id} key={conv._id} className="flex items-center gap-2 py-3 px-2 border border-transparent hover:border-green-500 hover:rounded cursor-pointer">
                <div>
                  <Avtar
                    profile_pic={conv.userDetails.profile_pic}
                    name={conv.userDetails.name}
                    hight={50}
                    width={50}
                  />
                </div>
                <div>
                  <h3 className="text-ellipsis line-clamp-1 flex items-center gap-1 font-semibold text-sm">
                    {conv?.userDetails?.name}
                  </h3>
                  <div className="text-slate-500 text-xs flex items-center gap-1">
                    <div className="flex items-center gap-1">
                      {conv.lastMsg.video && (
                        <div className="flex items-center gap-1">
                          <span>
                            <FaVideo />
                          </span>
                          {!conv.lastMsg.text && <span>Video</span>}
                        </div>
                      )}
                      {conv.lastMsg.imageUrl && (
                        <div className="flex items-center gap-1">
                          <span>
                            <BsImage />
                          </span>
                          {!conv.lastMsg.text && <span>Image</span>}
                        </div>
                      )}
                    </div>
                    
                    <p className="text-ellipsis line-clamp-1">{conv.lastMsg.text}</p>
                  </div>
                  
                </div>
                { 
                Boolean(conv.unseenMsg) && (<p className="text-xs h-6 w-6 flex justify-center items-center ml-auto p-1 bg-green-500 text-white font-semibold rounded-full">{conv.unseenMsg}</p>)
                }
                
              </NavLink>
            );
          })}
        </div>
      </div>
      {editUserOpen && (
        <EditUserDetail onClose={() => seteditUserOpen(false)} user={user} />
      )}

      {openSerchUser && <SerchUser onClose={() => setOpenSerchUser(false)} />}
    </div>
  );
}

export default Sidebar;
