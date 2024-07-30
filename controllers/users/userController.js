import asyncHandler from "express-async-handler";
import generateToken from "../../utils/generateToken.js";
import prisma from "../../prismaClient.js";
import { getPasswordHash, matchPasswordWithHash } from "../../utils/utils.js";

const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  const userExits = await prisma.user.findFirst({ where: { email } });
  if (userExits) {
    res.status(400);
    throw new Error("User already exists");
  }

  const hashedPassword = await getPasswordHash(password);

  const newUser = await prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    },
  });

  return res.status(201).json({
    sucess: true,
    message: "Created user Sucessfully.",
    data: newUser
  });
});

// Login
const authUser = asyncHandler(async (req, res) => {
  const { email, password, isRememberMeChecked } = req.body;

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (user && (await matchPasswordWithHash(password, user.password))) {
    const { id, firstName, email } = user;
    const tokenValidityInDays = isRememberMeChecked ? 7 : 1;
    generateToken(res, user.id, tokenValidityInDays);
    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        lastLogin: new Date()
      }
    })
    res.status(201).json({
      userId: id,
      firstName,
      email,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0)
  })
  res.status(200).json({
    success: true,
    message: "User Logged out"
  });
})

const getUserProfile = asyncHandler(async (req, res) => {
  if(req.user) {
    res.status(200).json({
      success: true,
      message: "Fetched user successfully.",
      data: req.user
    })
  } else {
    throw new Error("User not found.")
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {

});

const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findFirst({
    where: { id }
  })
  if(user) {
    res.status(200).json({
      success: true,
      message: "Fetched User Successfully.",
      data: user
    });
  } else {
    throw new Error("No user found with given id.")
  }
})

const updateUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const updatedUser = await prisma.user.update({
    where: { id },
    data
  })
  res.status(200).json({
    success: true,
    message: "Updated User Successfully.",
    data: updatedUser
  });
})

const deleteUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deletedUser = await prisma.user.delete({
    where: { id }
  })
  res.status(200).json({
    success: true,
    message: "Deleted User Successfully."
  })
})

export {
  registerUser,
  authUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUserById,
  updateUserById,
  deleteUserById
};
