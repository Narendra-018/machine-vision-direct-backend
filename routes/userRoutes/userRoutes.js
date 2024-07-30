import express from "express";
import { 
  registerUser,
  authUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUserById,
  updateUserById,
  deleteUserById
} from "../../controllers/users/userController.js";
import { checkIfLoggedInUserIsAdmin, checkIfUserIsLoggedIn } from "../../middleware/authMIddleware.js";

const router = express.Router();

router.post("/", checkIfUserIsLoggedIn, checkIfLoggedInUserIsAdmin ,registerUser);
router.post("/auth", authUser);
router.post("/logout", logoutUser);
// Get Logged in user profie.
router.get("/profile", checkIfUserIsLoggedIn, getUserProfile);

router.route("/:id", checkIfUserIsLoggedIn, checkIfLoggedInUserIsAdmin)
      .get(getUserById)
      .put(updateUserById)
      .delete(deleteUserById)

export default router;