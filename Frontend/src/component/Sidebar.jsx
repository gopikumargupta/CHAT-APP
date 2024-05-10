import React, { useState } from "react";
import { MdOutlineChat } from "react-icons/md";
import { FaUserPlus } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import { RiLogoutBoxLine } from "react-icons/ri";
import Avtar from './Avtar'
import { useSelector } from "react-redux";
import EditUserDetail from "./EditUserDetail";


function Sidebar() {
    const user= useSelector((state)=>state?.user)
    const[editUserOpen,seteditUserOpen]=useState(true)
  return (
    <div className="h-full w-full">
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
            <button className="mx-auto gap-1" title={user.name} onClick={()=>seteditUserOpeneditUserOpen()}>
                <Avtar
                width={42}
                hight={42}
                name={user.name}
                />
                
            </button>
            <button title="LogOut" className="w-12 h-12 bg-red-400 flex justify-center items-center cursor-pointer hover:bg-slate-200 mt-1">
            <span className="-ml-2">
            <RiLogoutBoxLine
            size={25}/>
            </span>
            </button>

        </div>
      </div>
      {
        editUserOpen&&(
            <EditUserDetail onClose={()=>seteditUserOpen(false)} user={user}/>
        )
      }
      

    </div>
  );
}

export default Sidebar;
