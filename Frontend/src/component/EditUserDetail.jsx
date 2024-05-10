import React, { useState,useEffect } from "react";
import Avtar from "./Avtar";
import { uploadFile } from "../helpers/uploadFiles.js";

function EditUserDetail({ onClose, user }) {
  const [data, setData] = useState({
    name: user?.user,
    profile_pic: user.profile_pic,
  });
  useEffect(()=>{
    setData((preve)=>{
        return{
            ...preve,
            ...user
        }
    })
},[user])
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

    setData((prev) => {
      return {
        ...prev,
        profile_pic: uploadPhoto?.url,
      };
    });
  };
  const handleSubmet = async (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-40 flex justify-center items-center">
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
            <label htmlFor="profile_pic">Photo:</label>
            <div className="my-1 flex items-center gap-3">
              <Avtar
                width={40}
                hight={40}
                imageUrl={data?.profile_pic}
                name={data?.name}
              />
              <button className="font-semibold">Change Photo</button>
              <input
                type="file"
                className="hidden"
                onChange={handleUploadPhoto}
              />
            </div>
          </div>
          <div className="flex w-fit ml-auto mt-2">
            <button className="border-red-300 bg-sky-400 text-white border px-4 py-1 mr-2 rounded-xl hover:bg-red-500">
              Cancle
            </button>
            <button className="border-red-300 bg-sky-400 text-white border px-4 py-1 rounded-xl hover:bg-green-500">
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
