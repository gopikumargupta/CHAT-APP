

const url=`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_REACT_APP_CLOUDNARY_NAME}/auto/upload`






export const uploadFile=async(file)=>{
    const formData = new FormData();
    formData.append('file',file)
    formData.append("upload_preset","ChatApp")
    const response= await fetch(url,{
        method:'post',
        body:formData
    })
    const resData=await response.json()
    return resData
}