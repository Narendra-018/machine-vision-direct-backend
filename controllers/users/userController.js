import asyncHandler from "express-async-handler";
import generateToken from "../../utils/generateToken.js";
import prisma from "../../prismaClient.js";
import { getPasswordHash } from "../../utils/utils.js";

const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  const userExits = await prisma.user.findFirst({ where: { email }});
  if(userExits) {
    res.status(400);
    throw new Error("User already exists")
  }

  const hashedPassword = await getPasswordHash(password);

  const newUser = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role      
    }
  })

  return res.status(201).json({
    sucess: true,
    message: "Created user Sucessfully."
  })
})

const authUser = asyncHandler(async (req,res) => {

})

const logoutUser = asyncHandler(async (req,res) => {

})

const getUserProfile = asyncHandler(async (req,res) => {
 
})

const updateUserProfile = asyncHandler(async (req,res) => {
  const user = await User.findById({ _id: req.user._id })
  
}) 

export { 
  registerUser,
  authUser,
  logoutUser,
  getUserProfile,
  updateUserProfile
};