import { Router } from "express";
import { registerUSer,logout,checkEmail,cheakPassword,currentUser,updateUserDetails,SearchUser } from "../controller/user.controller.js"; 


const router=Router()

    


router.route('/singup').post(registerUSer)

router.route('/email').post(checkEmail)
router.route('/password').post(cheakPassword)

router.route('/user-details').get(currentUser)
router.route('/logout').get(logout)

router.route('/update-details').post(updateUserDetails)


router.route('/search-User').post(SearchUser)


export default router;