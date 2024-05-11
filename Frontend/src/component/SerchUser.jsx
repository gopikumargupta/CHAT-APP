import React, { useEffect, useState } from 'react'
import { FaSearch } from "react-icons/fa";
import Loding from './Loding';
import UserSearchCard from './UserSearchCard';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ImCross } from "react-icons/im";

function SerchUser({onClose}) {
    const[searchUser,setSearchUSer]=useState([])
    const[loding,setLoading]=useState(false)
    const[serchUserInput,setSearchUserInput]=useState("")


    const handleSearchUser = async()=>{
        const url = `${import.meta.env.VITE_BACKEND_URL}/search-User`;
        
        
        try {
            setLoading(true)
            const response = await axios.post(url,
                {search:serchUserInput})
              
            setSearchUSer(response.data.data)
            setLoading(false)
            console.log(response.data)




            
        } catch (error) {
            toast.error(error?.response?.data?.message)
            console.log("err",error)
            
        }

    }
    useEffect(()=>{
        handleSearchUser()

    },[serchUserInput])
    console.log(serchUserInput)
    console.log(searchUser)
  return (
    
    <div className='fixed top-0 bottom-0 left-0 right-0 bg-slate-700 bg-opacity-40 p-2'>
      <div className='w-full max-w-lg mx-auto mt-12 m-2'>
        <div className='bg-white rounder h-14 overflow-hidden flex'>
            <input type="text"
            placeholder='Search User By Name, Email...'
            className='w-full outline-none py-1 h-full px-2'
            onChange={(e)=>(setSearchUserInput(e.target.value))}
            value={serchUserInput} />
            <div className='h-14 w-14 flex justify-center items-center'>
                <FaSearch size={30}/>
            </div>
        </div>
        {/** Display users */}
        <div className='bg-white mt-2 w-full p-4 rounded'>
            {
                searchUser.length===0 && !loding &&(
                    <p className='text-center text-slate-500'> NO USER FOUND</p>
                )
            }
            {
                loding &&(
                    <p><Loding/></p>
                )

            }
            {
                searchUser.length>0 && !loding&& (
                    searchUser.map((user,index)=>{
                        return(
                            <UserSearchCard key={user._id} user={user} onClose={onClose} />

                        )
                    }
                )
                )

                
            }

        </div>
      </div>
      <div onClick={onClose} className='absolute top-0 right-0 text-2xl p-2 lg:text-4xl hover:text-red-400'>
        <button>
        <ImCross/>

        </button>
      </div>
      
    </div>
  )
}

export default SerchUser
