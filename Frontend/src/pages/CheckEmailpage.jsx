import React, { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { uploadFile } from "../helpers/uploadFiles.js";
import axios from "axios";
import toast from "react-hot-toast";
import { FaRegCircleUser } from "react-icons/fa6";

function CheckEmailpage() {
  const [data, setData] = useState([
    {
      
      email: "",
      
    },
  ]);

  
  const Navigate = useNavigate();
  
  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  
  const handleSubmet = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${import.meta.env.VITE_BACKEND_URL}/email`;
    try {
      const response = await axios.post(url, data);
      
      toast.success(response.data.message);
      if (response.data.succes) {
        setData({
          
          email: "",
          
        });
        Navigate("/password",{
          state:response?.data.data
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log("error", error);
    }
  };
  return (
    <div className="mt-5">
      <div className="bg-white  w-full max-w-sm  rounded overflow-hidden p-4 mx-auto">
      <div className="w-fit mx-auto mb-2">
        <FaRegCircleUser 
        size={85}/>

        </div>

        <h3>Welcome Here To Chat</h3>
        
        <form className="grid gap-4 mt-3" onSubmit={handleSubmet}>
          
          <div className="flex flex-col">
            <label htmlFor="email">Email :</label>
            <input
              type="email"
              id="email"
              placeholder="Enter Your Email"
              name="email"
              className="bg-slate-100 px-2 py-1 rounded-md"
              value={data.email}
              onChange={handleOnchange}
              required
            />
          </div>
          
          
          <button className="bg-green-400 text-lg px-4 py-1 hover:bg-sky-400 rounded mt-4 font-bold text-white leading-relaxed tracking-wide">
            Login
          </button>
        </form>
        <p className="my-3 text-center">
          New User ?{" "}
          <Link to={"/singup"} className="hover:text-red-300 font-semibold">
            SingUp
          </Link>
        </p>
      </div>
    </div>
  );
}

export default CheckEmailpage;
