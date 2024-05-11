import React from "react";
import Avtar from "./Avtar";
import { Link } from "react-router-dom";

function UserSearchCard({ user, onClose }) {
  return (
    <Link to={"/"+user._id} onClick={onClose} className="flex items-center gap-3 p-2 lg:p-4 border border-transparent border-b-slate-200 hover:border hover:border-green-400 rounded cursor-pointer">
      <div>
        <Avtar width={50} hight={50} name={user?.name} userID={user._id} />
      </div>
      <div>
        <div className="font-semibold text-ellipsis line-clamp-1">{user?.name}</div>
        <p className="text-sm text-ellipsis line-clamp-1">{user.email}</p>
      </div>
    </Link>
  );
}

export default UserSearchCard;
