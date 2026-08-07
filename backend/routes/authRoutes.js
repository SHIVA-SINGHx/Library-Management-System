import express from "express"
import { completeProfile, getProfile, getUsers, loginUser, registerAdmin, registerUser, updateProfile, verifyOtp } from "../controllers/authController.js";
import { authRoles, authToken } from "../middleware/authMiddleware.js";

const authRouter = express.Router(  );

authRouter.post("/register", registerUser)
authRouter.post("/verify-otp", verifyOtp)
authRouter.post("/complete-profile", completeProfile)


authRouter.post("/login", loginUser)
authRouter.post("/register-admin", registerAdmin)


authRouter.get("/me", authToken, getProfile)
authRouter.put("/update-profile", authToken, updateProfile)

authRouter.get("/users", authToken, authRoles("admin"), getUsers);


export default authRouter
