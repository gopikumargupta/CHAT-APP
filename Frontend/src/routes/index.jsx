import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import RegisterPage from '../pages/Registerpage'
import Home from '../pages/Home'
import CheckEmailpage from'../pages/CheckEmailpage'
import CheckpasswordPage from "../pages/CheckpasswordPage";
import Message from "../component/Message";
import AuthLayout from "../layout";
import ForgotPassword from "../pages/ForgotPassword";

const router=createBrowserRouter([
    {
        path:'/',
        element:<App/>,
        children:[
            {
                path:"singup",
                element:<AuthLayout><RegisterPage/></AuthLayout>

            },
            { path:"email",
            element:<AuthLayout><CheckEmailpage/></AuthLayout>

            },{
                path:'password',
                element:<AuthLayout><CheckpasswordPage/></AuthLayout>
            },{
                path:"forgot_password",
                element:<AuthLayout><ForgotPassword/></AuthLayout>
            },{
                path:'/',
                element:<Home/>,
                children:[{
                    path:':userId',
                    element:<Message/>
            }]
            }
        ]
    }

])
export default router;