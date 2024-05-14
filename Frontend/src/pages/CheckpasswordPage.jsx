import React, { useEffect, useState } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { uploadFile } from "../helpers/uploadFiles.js";
import axios from "axios";
import toast from "react-hot-toast";
import { FaRegCircleUser } from "react-icons/fa6";
import Avtar from "../component/Avtar.jsx";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "../Redux/UserSlice.jsx";

function CheckpasswordPage() {
  const [data, setData] = useState([
    {
      password: "",
      userID : ""
    },
  ]);

  const Navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!location?.state?.name) {
      Navigate("/email");
    }
  }, []);

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
    const URL = `${import.meta.env.VITE_BACKEND_URL}/password`;

    try {
      
        const response = await axios({
          method :'post',
          url : URL,
          data : {
            userID : location?.state?._id,
            password : data.password
          },
          withCredentials : true
        });

      toast.success(response?.data?.message);

      if (response.data.succes) {
        dispatch(setToken(response?.data?.token));
        localStorage.setItem("token", response?.data?.token);
        setData({
          password: "",
        });
        Navigate("/");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log("error", error);
    }
  };
  return (
    <div className="mt-5">
      <div className="bg-white  w-full max-w-sm  rounded overflow-hidden p-4 mx-auto">
        <div className="w-fit mx-auto mb-2 flex justify-center items-center flex-col">
          <Avtar
            width={70}
            name={location?.state?.name}
            hight={70}
            profile_url={location?.state?.profile_url}
          />

          <h2 className="font-semibold text-lg mt-1">
            {location?.state?.name}
          </h2>
        </div>

        <form className="grid gap-4 mt-3" onSubmit={handleSubmet}>
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

          <button className="bg-green-400 text-lg px-4 py-1 hover:bg-sky-400 rounded mt-4 font-bold text-white leading-relaxed tracking-wide">
            Login
          </button>
        </form>
        <p className="my-3 text-center">
          <Link
            to={"/forgot_password"}
            className="hover:text-red-300 font-semibold"
          >
            Forgot Password ?
          </Link>
        </p>
      </div>
    </div>
  );
}

export default CheckpasswordPage;
