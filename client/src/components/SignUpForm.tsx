import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BiError } from "react-icons/bi";
import { IoMdCheckmarkCircle } from "react-icons/io";
import OAuth from "./OAuth";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/userReducer";
import { RootState } from "../store";

const SignUpForm = () => {
  const { error, loading } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountCreated, setAccountCreated] = useState(false);

  const onSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    dispatch(signInStart());
    setAccountCreated(false);
    const body = JSON.stringify({ userName, email, password });
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure());
      } else {
        dispatch(signInSuccess(data));
        setAccountCreated(true);
      }
    } catch (err) {
      dispatch(signInFailure());
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7 text-slate-700">
        Sign Up
      </h1>
      {error && (
        <p className="flex align-middle justify-center gap-1 bg-red-400 max-w-lg p-3 m-3 rounded-lg font-semibold text-white">
          <BiError size={25} />
          <span>Something went wrong while creating your account!</span>
        </p>
      )}
      {accountCreated && (
        <p className="flex align-middle justify-center gap-1 bg-green-300 max-w-lg p-3 m-3 rounded-lg font-semibold text-white">
          <IoMdCheckmarkCircle size={25} />
          <span>Account Created Successfully! Please SignIn to Continue</span>
        </p>
      )}
      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="User Name"
          className="border p-3 rounded-lg"
          id="userName"
          onChange={(e) => setUserName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          disabled={loading}
          type="submit"
          className="bg-slate-700 rounded-lg text-white p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>
        <OAuth />
      </form>
      <div className="mt-5">
        <p>
          Have an account?
          <Link to="/sign-in">
            <span className="text-blue-700 px-1 font-semibold">SignIn</span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
