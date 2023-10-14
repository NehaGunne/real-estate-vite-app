import "./App.css";
import Header from "./components/Header";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./pages/Profile";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/sign-up" Component={SignUp} />
        <Route path="/sign-in" Component={SignIn} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" Component={Profile} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
