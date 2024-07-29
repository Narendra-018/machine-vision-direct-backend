import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

const protect = asyncHandler(async (req,res,next) => {
  let token;
  token = req.cookies.jwt;

  if(token) {
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      next();
    } catch(err) {
      res.status(401);
      throw new Error("Not authorized, invalid token");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

export { protect };