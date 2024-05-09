import React, { useState } from "react";
import { RiFileCloseFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { uploadFile } from "../helpers/uploadFiles.js";
import axios from'axios'
import toast from "react-hot-toast";


function Registerpage() {
  const [data, setData] = useState([
    {
      name: "",
      email: "",
      password: "",
      profile_pic: "",
    },
  ]);
  
  const [uploadPhoto, setUploadphoto] = useState("");
  const Navigate=useNavigate()
  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    const uploadPhoto=await uploadFile(file)
    console.log(uploadPhoto)
    setUploadphoto(file);
    setData((prev)=>{
      return{
        ...prev,
        profile_pic:uploadPhoto?.url
      }
    })
  };
  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  const handleClearupload = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setUploadphoto(null);
    
  };
  const handleSubmet = async(e) => {
    e.preventDefault();
    e.stopPropagation();
    const url=`${import.meta.env.VITE_BACKEND_URL}/singup`
    try {
      const response= await axios.post(url,data)
      console.log(response)
      toast.success(response.data.message)
      if(response.data.succes){
        setData(
          {
            name: "",
            email: "",
            password: "",
            profile_pic: "",
          },
        )
        Navigate('/email')

      }
      
    } catch (error) {
      toast.error(error?.response?.data?.message)
      console.log("error",error)
      
    }


    

  };
  

  return (
    <div className="mt-5">
      <div className="bg-white  w-full max-w-sm  rounded overflow-hidden p-4 mx-auto">
        <h3>Welcome Here To Chat</h3>
        <form className="grid gap-4 mt-5" onSubmit={handleSubmet}>
          <div className="flex flex-col">
            <label htmlFor="name">Name :</label>
            <input
              type="text"
              id="name"
              placeholder="Enter Your name"
              name="name"
              className="bg-slate-100 px-2 py-1 rounded-md"
              value={data.name}
              onChange={handleOnchange}
              required
            />
          </div>
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
          <div className="flex flex-col">
            <label htmlFor="password">Password :</label>
            <input
              type="password"
              id="password"
              placeholder="Enter Your Password"
              name="password"
              className="bg-slate-100 px-2 py-1 rounded-md"
              value={data.password}
              onChange={handleOnchange}
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="profile_pic">
              Photo :
              <div className="h-14 bg-slate-200 flex justify-center items-center border hover:border-red-300 cursor-pointer rounded-md">
                <p className="text-sm max-w-[300px] text-ellipsis line-clamp-1 ">
                  {uploadPhoto?.name ? uploadPhoto?.name : "Upload Profile Pic"}{" "}
                </p>
                {uploadPhoto?.name && (
                  <button
                    className="text-lg ml-2 hover:text-red-300"
                    onClick={handleClearupload}
                  >
                    <RiFileCloseFill />
                  </button>
                )}
              </div>
            </label>
            <input
              type="file"
              id="profile_pic"
              name="profile_pic"
              className="bg-slate-100 px-2 py-1 rounded-md hidden"
              onChange={handleUploadPhoto}
            />
          </div>
          <button className="bg-green-400 text-lg px-4 py-1 hover:bg-sky-400 rounded mt-4 font-bold text-white leading-relaxed tracking-wide">
            SingUp
          </button>
        </form>
        <p className="my-3 text-center">
          Already have Account ?{" "}
          <Link to={"/email"} className="hover:text-red-300 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Registerpage;
