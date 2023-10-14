import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import { setAuthToken } from "../utils/setAUthToken.js";

export const signUp = async (req, res, next) => {
  try {
    const { userName, email, password } = req.body;
    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ userName, email, password: hashedPassword });
    await newUser.save();
    res.status(201).json("user created successfully");
  } catch (err) {
    next(err);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, "Wrong credentials"));
    }
    const { password: pass, ...rest } = validUser._doc;
    setAuthToken(rest, res);
  } catch (err) {
    next(err);
  }
};

export const googleAuth = async (req, res, next) => {
  try {
    const { userName, email, photoURL } = req.body;
    const validUser = await User.findOne({ email });
    if (validUser) {
      const { password: pass, ...rest } = validUser._doc;
      setAuthToken(rest, res);
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const uniqueUserName =
        userName.split(" ").join("").toLowerCase() +
        Math.random().toString(36).slice(-4);
      const newUser = new User({
        userName: uniqueUserName,
        email,
        password: hashedPassword,
        avatar: photoURL,
      });
      await newUser.save();
      const { password: pass, ...rest } = newUser._doc;
      setAuthToken(rest, res);
    }
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie("auth_token");
    res.status(200).json("Signed out successfully");
  } catch (error) {
    next(error);
  }
};
