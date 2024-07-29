import jwt from "jsonwebtoken";

const generateToken = (res,userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: expiesInDays+"d"
  });

  res.cookie(
    "jwt",
    token, 
    {
      httpOnly: true,
      secure: !process.env.NODE_ENV === "development",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * expiesInDays * 1000
    }
  )
}

export default generateToken;