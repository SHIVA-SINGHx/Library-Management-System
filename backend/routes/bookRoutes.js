import express from "express"
import { authRoles, authToken } from "../middleware/authMiddleware.js"
import { getFineSetting, getIssueManual, getStudentIssue, issueManualBook } from "../controllers/bookController.js"


const bookRouter = express.Router()


bookRouter.get("/setting", authToken, getFineSetting)
bookRouter.get("/issues/student", authToken, authRoles("user"), getStudentIssue)

bookRouter.get("/issues", authToken, authRoles("admin"), getIssueManual)
bookRouter.post("issues/manual", authToken, authRoles("admin"), issueManualBook)

export default bookRouter