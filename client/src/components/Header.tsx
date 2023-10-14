import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const Header = () => {
  const { user } = useSelector((state: RootState) => state.user);
  return (
    <div className="bg-slate-700 p-3 text-lg text-gray-200 flex justify-between items-center shadow">
      <div>
        <Link to="/">
          <h1 className="px-1 font-bold hover:underline">MyEstate</h1>
        </Link>
      </div>
      <div className="flex items-center bg-gray-200 rounded-lg p-2">
        <input
          type="text"
          className="text-black bg-transparent focus:outline-none w-20 sm:w-64"
          placeholder="Search..."
        />
        <FaSearch className="text-black" />
      </div>
      <div className="flex gap-5 sm:px-3">
        <Link to="/" className="font-semibold hover:underline">
          <h2>About</h2>
        </Link>
        {!user ? (
          <Link to="/sign-in" className="font-semibold hover:underline">
            <h2>SignIn</h2>
          </Link>
        ) : (
          <Link to="/profile">
            <img
              src={user.photoURL}
              className="w-7 h-7 rounded-full object-cover"
              alt="profile"
            />
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
