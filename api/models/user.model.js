import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    photoURL: {
      type: String,
      default:
        "https://www.emmegi.co.uk/wp-content/uploads/2019/01/User-Icon-300x300.jpg",
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
