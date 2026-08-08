import express from "express"
import { authRoles, authToken } from "../middleware/authMiddleware.js";
import { searchStudentbyRoll } from "../controllers/studentController.js";

const studentRouter = express.Router();

studentRouter.get("/search-by-roll", authToken, authRoles("admin"), searchStudentbyRoll);

export default studentRouter