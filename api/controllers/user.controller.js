import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";

export const updateUser = async (req, res, next) => {
  try {
    const { email, userName, _id, photoURL } = req.body;
    if (req.body?.password) {
      const hashedPassword = bcryptjs.hashSync(req.body.password, 10);
      const user = await User.findOneAndUpdate(
        { _id },
        { email, userName, photoURL, password: hashedPassword },
        { new: true },
      );
      const { password: pass, ...rest } = user._doc;
      res.status(200).json(rest);
    } else {
      const user = await User.findOneAndUpdate(
        { _id },
        { email, userName, photoURL },
        { new: true },
      );
      const { password: pass, ...rest } = user._doc;
      res.status(200).json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await User.findOneAndDelete({ _id: id });
    if (result) {
      res.clearCookie("auth_token");
      res.status(200).json("User Deleted successfully");
    } else {
      return next(errorHandler(400, "User not found"));
    }
  } catch (error) {
    next(error);
  }
};
