import React, { useEffect, useRef, useState } from "react";
import { BiError } from "react-icons/bi";
import { RootState } from "../store";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import {
  userUpdateStart,
  userUpdateSuccess,
  userUpdateFailure,
  deleteUser as deleteUserAction,
  signOutUser,
} from "../redux/userReducer";

const Profile = () => {
  const dispatch = useDispatch();
  const [file, setFile] = useState<null | File>(null);
  const [fileUploadProgress, setFileUploadProgress] = useState(0);
  const [fileUploadError, SetFileUploadError] = useState(false);
  const [photoURL, setPhotoURL] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, error } = useSelector((state: RootState) => state.user);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file: File) => {
    SetFileUploadError(false);
    setLoading(true);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;

    const storageRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        );
        setFileUploadProgress(progress);
      },
      () => {
        SetFileUploadError(true);
        setLoading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setPhotoURL(downloadURL);
          setLoading(false);
        });
      },
    );
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    dispatch(userUpdateStart());
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const body = { _id: user?._id };
      for (const [key, value] of formData.entries()) {
        if (key === "photoURL") {
          body[key] = photoURL ? photoURL : user?.photoURL;
        } else {
          body[key] = value;
        }
      }
      const res = await fetch("/api/user/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(userUpdateFailure());
      } else {
        dispatch(userUpdateSuccess(data));
      }
    } catch (err) {
      dispatch(userUpdateFailure());
    }
  };
  const deleteUser = async () => {
    try {
      const res = await fetch(`/api/user/delete/${user?._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data);
      } else {
        dispatch(deleteUserAction());
      }
    } catch (err) {
      console.log(err);
    }
  };

  const signOut = async () => {
    try {
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        console.log(data);
        return;
      }
      dispatch(signOutUser());
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7 text-slate-700">
        Profile
      </h1>
      {error && (
        <p className="flex align-middle justify-center gap-1 bg-red-400 max-w-lg p-3 m-3 rounded-lg font-semibold text-white">
          <BiError size={25} />
          <span>Unable to update Profile! Please try again later.</span>
        </p>
      )}
      {fileUploadError && (
        <p className="flex align-middle justify-center gap-1 text-red-900 font-semibold text-center text-sm">
          <BiError size={25} />
          <span>
            Something went wrong while uploading your image! <br />
            image size must be less than 2mb
          </span>
        </p>
      )}
      <form className="flex flex-col  gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          ref={inputRef}
          name="photoURL"
          hidden
          accept="image/*"
          onChange={(e) =>
            e.target?.files ? setFile(e.target.files[0]) : null
          }
        />
        <img
          onClick={() => (inputRef.current ? inputRef.current.click() : null)}
          src={user?.photoURL}
          alt="profile-img"
          className="w-24 h-24 rounded-full object-cover self-center cursor-pointer"
        />
        <p className=" text-green-900 font-sm text-center">
          {fileUploadProgress > 0 && fileUploadProgress < 100 && (
            <span>Uploading Percentage: {fileUploadProgress}%</span>
          )}
          {fileUploadProgress === 100 && (
            <span>Image uploaded successfully!</span>
          )}
        </p>
        <input
          type="text"
          placeholder="User Name"
          className="border p-3 rounded-lg"
          name="userName"
          defaultValue={user?.userName}
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          name="email"
          defaultValue={user?.email}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          name="password"
        />
        <button
          disabled={loading}
          type="submit"
          className="bg-slate-700 rounded-lg text-white p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Update"}
        </button>
      </form>
      <div className="mt-5 flex justify-between font-semibold">
        <span className="text-red-800 cursor-pointer" onClick={deleteUser}>
          Delete account
        </span>
        <span className="text-red-800 cursor-pointer" onClick={signOut}>
          SignOut
        </span>
      </div>
    </div>
  );
};

export default Profile;
