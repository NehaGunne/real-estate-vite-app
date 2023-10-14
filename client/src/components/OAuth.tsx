import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { AiOutlineGoogle } from "react-icons/ai";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/userReducer";
import { useNavigate } from "react-router-dom";

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmit = async () => {
    dispatch(signInStart());
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure());
      } else {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure());
    }
  };
  return (
    <button
      onClick={handleSubmit}
      type="button"
      className="flex justify-center align-middle  gap-1 bg-red-700 rounded-lg text-white p-3 uppercase hover:opacity-95 disabled:opacity-80"
    >
      Continue With <AiOutlineGoogle size={25} />
    </button>
  );
};

export default OAuth;
