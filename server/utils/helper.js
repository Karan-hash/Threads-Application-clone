import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = async (userId, res) => {
  const jwttoken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("jwt", jwttoken, {
    httpOnly: true, // more secure
    maxAge: 7 * 24 * 60 * 60 * 1000, // 15 days
    sameSite: "strict", // CSRF
  });

  return jwttoken;
};

export default generateTokenAndSetCookie;
