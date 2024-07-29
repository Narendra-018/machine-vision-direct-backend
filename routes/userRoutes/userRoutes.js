import express from "express";
import { 
  registerUser,
  authUser,
  logoutUser,
  getUserProfile,
  updateUserProfile
} from "../../controllers/users/userController.js";
import { protect } from "../../middleware/authMIddleware.js";

const router = express.Router();

router.post("/", registerUser);

export default router;