import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import prisma from "../prismaClient.js";

const checkIfUserIsLoggedIn = asyncHandler(async (req,res,next) => {
  let token;
  token = req.cookies.jwt;

  if(token) {
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const user = await prisma.user.findFirst({
        where: {
          id: decodedToken.userId
        }
      })
      if(!user) throw new Error("No user found.")
      req.user = user;
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

const checkIfLoggedInUserIsAdmin = asyncHandler(async (req, res, next) => {
  if(req.user && req.user.role === "ADMIN") {
    next();
  } else {
    res.status(401);
    throw new Error("Admin can only do this operation.");
  }
})

export { checkIfUserIsLoggedIn, checkIfLoggedInUserIsAdmin };