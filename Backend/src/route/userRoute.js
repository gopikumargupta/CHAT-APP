import { Router } from "express";
import { registerUSer,logout,checkEmail,cheakPassword,currentUser,updateUserDetails } from "../controller/user.controller.js"; 


const router=Router()


router.route('/singup').post(registerUSer)

router.route('/email').post(checkEmail)
router.route('/password').post(cheakPassword)

router.route('/user-details').get(currentUser)
router.route('/logout').get(logout)

router.route('/update-details').post(updateUserDetails)


export default router;