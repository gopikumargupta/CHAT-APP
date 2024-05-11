import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { logout, setUser } from "../Redux/UserSlice";
import { useEffect } from "react";
import axios from "axios";
import Sidebar from "../component/Sidebar";
import logo from '../assets/logo.jpg'

function Home() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const location=useLocation()

  const feachUserDetail = async () => {
    const URL = `${import.meta.env.VITE_BACKEND_URL}/user-details`;
    console.log(URL);

    try {
      const response = await axios({
        url: URL,
        withCredentials: true,
      });
      console.log("home",response)

      dispatch(setUser(response.data.data));

      if (response.data.data.logout) {
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
  const basepath=location.pathname === '/'

  return (
    <div className="grid grid-cols-[300px,1fr] h-screen max-h-screen">
      <section className={`bg-white ${!basepath && 'hidden' } lg:block` }>
        <Sidebar/>
      </section>
      
      
      <section className={`${basepath && 'hidden'}`}>
        <Outlet />
      </section>

      <div className="lg:flex justify-center items-center flex-col gap-2 ">
        <div>
          <img src={logo} alt="logo" width={250}  />
        </div>
        <p className="text-lg mt-2  text-slate-500">Select User TO Send Message</p>
      </div>
      
    </div>
  );
}

export default Home;
