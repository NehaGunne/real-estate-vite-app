import jwt from "jsonwebtoken";
export const setAuthToken = (user, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res
    .cookie("auth_token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    })
    .status(200)
    .json(user);
};
