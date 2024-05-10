import { Router } from "express";
import { registerUSer,logout,checkEmail,cheakPassword,currentUser,updateUserDetails } from "../controller/user.controller.js"; 


const router=Router()
router.get("/", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Max-Age", "1800");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader( "Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" ); 
     });
    


router.route('/singup').post(registerUSer)

router.route('/email').post(checkEmail)
router.route('/password').post(cheakPassword)

router.route('/user-details').get(currentUser)
router.route('/logout').get(logout)

router.route('/update-details').post(updateUserDetails)


export default router;