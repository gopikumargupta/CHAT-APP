import React, { useState, useEffect, useRef } from "react";
import Avtar from "./Avtar";
import { uploadFile } from "../helpers/uploadFiles.js";
import Divider from "./Divider.jsx";
import axios from'axios'
import toast from 'react-hot-toast'
import { useDispatch } from "react-redux";
import {setUser} from '../Redux/UserSlice.jsx'

function EditUserDetail({ onClose, user }) {
  console.log(user)
  const [data, setData] = useState({
    name: user?.name,
    profile_pic: user.profile_pic,
  });
  const uploadPhotoRef=useRef()
  const dispatch=useDispatch()
  useEffect(() => {
    setData((preve) => {
      return {
        ...preve,
        ...user,
      };
    });
  }, [user]);
  const handleOnchange = (e) => {
    const { name, value } = e.target;

    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0];
    const uploadPhoto = await uploadFile(file);

    setData(prev => {
      return {
        ...prev,
        profile_pic: uploadPhoto?.url,
      };
    });
    
  };
  const handleSubmet = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {

      const URL = `${import.meta.env.VITE_BACKEND_URL}/update-details`;
      const response = await axios({
        method : 'post',
        url : URL,
        data : data,
        withCredentials : true
    })
        
        


      
      console.log(response)
      toast.success(response?.data?.message)
      if(response?.data?.succes){
        
        dispatch(setUser(response?.data?.data))
        onClose()
      }
      
      
    } catch (error) {
      toast.error(error?.response?.data?.message)
      console.log(error)
      
      
    }
  };
  const handleOpenUploadPhoto=()=>{
    uploadPhotoRef.current.click()

  }
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-40 flex justify-center items-center z-10">
      <div className="bg-white p-4 py-6 m-1 rounded w-full max-w-sm">
        <h2 className="font-semibold">Profile Detail</h2>
        <p className="text-sm">Edit User Detail</p>

        <form className="grid gap-3 mt-3" onSubmit={handleSubmet}>
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={data?.name}
              onChange={handleOnchange}
              className="w-full py-1 px-2 focus:outline-green-400 border"
            />
          </div>
          <div>
            <div>Photo:</div>

            <div className="my-1 flex items-center gap-3">
              <Avtar
                width={40}
                hight={40}
                profile_pic={data?.profile_pic}
                name={data?.name}
              />
              <label htmlFor="profile_pic">
                <button className="font-semibold" onClick={handleOpenUploadPhoto}>Change Photo</button>
                <input
                  type="file"
                  id="profile_pic"
                  className="hidden"
                  onChange={handleUploadPhoto}
                  ref={uploadPhotoRef}
                />
              </label>
            </div>
          </div>
          <Divider />
          <div className="flex w-fit ml-auto mt-2">
            <button
              onClick={onClose}
              className="border-red-300 bg-sky-400 text-white border px-4 py-1 mr-2 rounded-xl hover:bg-red-500"
            >
              Cancle
            </button>
            <button
              onClick={handleSubmet}
              
              
              className="border-red-300 bg-sky-400 text-white border px-4 py-1 rounded-xl hover:bg-green-500"
            >
              Save
            </button>
          </div>
        </form>
      </div>
      Edit user detail
    </div>
  );
}

export default EditUserDetail;
