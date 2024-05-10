import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { logout, setUser } from "../Redux/UserSlice";
import { useEffect } from "react";
import axios from "axios";
import Sidebar from "../component/Sidebar";

function Home() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  console.log("reduexuser", user);

  const feachUserDetail = async () => {
    const URL = `${import.meta.env.VITE_BACKEND_URL}/user-details`;
    console.log(URL);

    try {
      const response = await axios({
        url: URL,
        withCredentials: true,
      });

      dispatch(setUser(response.data.data));

      if (response.data.logout) {
        dispatch(logout());
        Navigate("/email");
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    feachUserDetail();
  }, []);

  return (
    <div className="grid grid-cols-[300px,1fr] h-screen max-h-screen">
      <section className="bg-white ">
        <Sidebar/>
      </section>
      
      
      <section>
        <Outlet />
      </section>
    </div>
  );
}

export default Home;
