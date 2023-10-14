import { BiError } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/userReducer";
import { RootState } from "../store";
import OAuth from "./OAuth";

const SignInForm = () => {
  const { error } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    dispatch(signInStart());
    const formData = new FormData(e.target as HTMLFormElement);
    const body = {};
    for (const [key, value] of formData.entries()) {
      body[key] = value;
    }
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure());
      } else {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (err) {
      dispatch(signInFailure());
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7 text-slate-700">
        Sign In
      </h1>
      {error && (
        <p className="flex align-middle justify-center gap-1 bg-red-400 max-w-lg p-3 m-3 rounded-lg font-semibold text-white">
          <BiError size={25} />
          <span>Something went wrong !</span>
        </p>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          name="email"
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          name="password"
          required
        />
        <button
          type="submit"
          className="bg-slate-700 rounded-lg text-white p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          Sign In
        </button>
        <OAuth />
      </form>
      <div className="mt-5">
        <p>
          Dont Have an account?
          <Link to="/sign-up">
            <span className="text-blue-700 px-1 font-semibold">SignUp</span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignInForm;
