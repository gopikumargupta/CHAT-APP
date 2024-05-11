import React, { useState } from "react";
import { MdOutlineChat } from "react-icons/md";
import { FaUserPlus } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import { RiLogoutBoxLine } from "react-icons/ri";
import Avtar from "./Avtar";
import { useSelector } from "react-redux";
import EditUserDetail from "./EditUserDetail";
import Divider from "./Divider";
import { GoArrowUpLeft } from "react-icons/go";

function Sidebar() {
  const user = useSelector((state) => state?.user);
  const [editUserOpen, seteditUserOpen] = useState(false);
  const [allUser, setAllUser] = useState([]);
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
            />
          </button>
          <button
            title="LogOut"
            className="w-12 h-12 bg-red-400 flex justify-center items-center cursor-pointer hover:bg-slate-200 mt-1"
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
        </div>
      </div>
      {editUserOpen && (
        <EditUserDetail onClose={() => seteditUserOpen(false)} user={user} />
      )}

      {
        
      }
    </div>
  );
}

export default Sidebar;
