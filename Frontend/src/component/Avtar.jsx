import React from 'react'
import { FaRegCircleUser } from "react-icons/fa6";

function Avtar({userID,name,profile_pic,width,hight}) {
    let avtarname=""
    if(name){
        const splitname=name?.split(" ")
        if(splitname.length>1){
            avtarname=splitname[0][0]+splitname[1][0]
        }else{
            avtarname=splitname[0][0]

        }

    }
    const bgColor=[
        'bg-slate-200',
        'bg-gray-400',
        'bg-red-300',
        'bg-orange-500',
        'bg-green-200',
        'bg-yellow-200',
        'bg-pink-200'
    ]
    const random=Math.floor(Math.random()*7)
    
  return (
    <div style={{width:width+"px",height:hight+"px"}} className={`text-slate-800 overflow-hidden rounded-full shadow border  font-bold `} >
        
        {
            
            profile_pic ? (
                <img
                src={profile_pic} 
                width={width}
                hight={hight}
                alt={name}
                className='overflow-hidden rounded-full '
                />
            ): (
                name ?(
                <div style={{width:width+"px",height:hight+"px"}} className={`overflow-hidden rounded-full flex justify-center items-center text-lg ${bgColor[random]}` }>
                    {avtarname}
                    

                </div>

                ):(<FaRegCircleUser 
                    size={width}/>)
            )
            
        }
      
    </div>
  )
}

export default Avtar
