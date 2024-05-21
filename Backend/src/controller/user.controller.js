import { getUserDetailsfromcookie } from "../middleware/getUserFromCookie.js";
import { User } from "../module/user.module.js";
import { AsyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const generateAccessAndRefereshToken = async (userID) => {
  try {
    const user = await User.findOne(userID);

    const accesstoken = user.genrateAccesToken();
    const refreshtoken = user.genrateRefreshToken();
    user.refreshtoken = refreshtoken;
    await user.save({ validateBeforeSave: false });
    return { accesstoken, refreshtoken };
  } catch (error) {
    console.log("ERR", error.message);
  }
};

export const registerUSer = AsyncHandler(async (req, res) => {
  const { name, email, password, profile_pic } = req.body;

  if (!name) {
    return res.status(401).json({
      message: "name is requires",
    });
  }
  if (!email) {
    return res.status(401).json({
      message: "email is requires",
    });
  }
  if (!password) {
    return res.status(401).json({
      message: "password is requires",
    });
  }

  const Cheackemail = await User.findOne({ email });

  if (Cheackemail) {
    return res.status(401).json({
      message: "User already exist",
      error: true,
    });
  }

  const user = await User.create({
    name,
    email,
    password,
    profile_pic,
  });
  const checkuser = await User.findById(user._id).select("-password");
  if (!checkuser) {
    return res.status(500).json({
      message: "something went wrong while registring user",
      error: true,
    });
  }

  return res.status(200).json({
    message: "user Registred Succesfully",
    data: checkuser,
    succes: true,
  });
});
export const loginUser = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(401).json({
      message: "email is requires",
    });
  }
  if (!password) {
    return res.status(401).json({
      message: "password is requires",
    });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({
      message: "user not found",
    });
  }
  console.log(user._id);
  const newpassword = await user.isPasswordCorrect(password);

  // if (!newpassword) {
  //   return res.status(401).json({
  //     message: "Bad cridencis",
  //   });
  // }

  const { accesstoken, refreshtoken } = await generateAccessAndRefereshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const opsation = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accesstoken", accesstoken, opsation)
    .cookie("refreshtoken", refreshtoken, opsation)
    .json({
      message: "user login succesfullly",
      data: loggedInUser,
    });
});

export const checkEmail = AsyncHandler(async (req, res) => {
  try {
    const { email } = req.body;

    const checkUserEmail = await User.findOne({ email }).select("-password");
    if (!checkUserEmail) {
      return res.status(400).json({
        message: "user not found",
      });
    }
    return res.status(200).json({
      message: "email verified",
      succes: true,
      data: checkUserEmail,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: true,
    });
  }
});

export const cheakPassword = AsyncHandler(async (req, res) => {
  const { password, userID } = req.body;

  const user = await User.findById(userID);

  if (!user) {
    return res.status(400).json({
      message: "no user found ",
    });
  }
  const newpassword = await user.isPasswordCorrect(password);
  if (!newpassword) {
    return res.status(400).json({
      message: "passwword is wrong ",
    });
  }
  const tokendata = {
    id: user._id,
    email: user.email,
  };

  const token = await jwt.sign(tokendata, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });

  const opsation = {
    http: true,
    secure: true,
  };
  return res.cookie("token", token, opsation).status(200).json({
    message: "login succesfully",
    token: token,
    succes: true,
  });
});
export const updateUserDetails = AsyncHandler(async (req, res) => {
  const token = req.cookies.token || "";
  const user = await getUserDetailsfromcookie(token);
  

  console.log("userRR", user);

  const { name, profile_pic } = req.body;

  const updateduser = await User.updateOne(
    { _id: user.id },
    { name, profile_pic }
  );

  const userInfo = await User.findById(user._id).select("-password");
  if(!userInfo){
    return res.status(200).json({
      message: "user info not found",
      data: null,
      succes: false,
    });

  }

  return res.status(200).json({
    message: "user updated succesfully",
    data: userInfo,
    succes: true,
  });
});

export const currentUser = AsyncHandler(async (req, res) => {
  const token = req.cookies?.token || "";

  if (!token) {
    return res.status(400).json({
      message: "no token found",
      logout: true,
    });
  }

  const user = await getUserDetailsfromcookie(token);
  return res.status(200).json({
    message: "user found succesfully",
    data: user,
  });
});

export const logout = AsyncHandler(async (req, res) => {
  const opsation = {
    http: true,
    secure: true,
  };
  return res.cookie("token", "", opsation).status(200).json({
    message: "logoutsucces fully",
    succes: true,
  });
});

export const SearchUser = AsyncHandler(async (req, res) => {
  const { search } = req.body;
  const queary = new RegExp(search, "i", "g");

  const user = await User.find({
    $or: [{ name: queary }, { email: queary }],
  }).select("-password");

  return res.json({
    message: "alluser",
    data: user,
    succes: true,
  });
});
