import express from "express"
import { authRoles, authToken } from "../middleware/authMiddleware.js"
import { applyFine, getFineSetting, getIssueManual, getStudentIssue, issueManualBook, removeFine, returnBook, updateSetting } from "../controllers/bookController.js"


const bookRouter = express.Router()


bookRouter.get("/fine-settings", authToken, getFineSetting)
bookRouter.get("/issues/student", authToken, authRoles("user"), getStudentIssue)

bookRouter.get("/issues", authToken, authRoles("admin"), getIssueManual)
bookRouter.post("issue/manual", authToken, authRoles("admin"), issueManualBook)

bookRouter.put("/issues/:id/return", authToken, authRoles("admin"), returnBook)
bookRouter.put("issues/:id/fine", authToken, authRoles("admin"), applyFine)

bookRouter.put("issues/:id/clear-fine", authToken, authRoles("admin"),removeFine )
bookRouter.put("/fine-settings", authToken, authRoles("admin"), updateSetting)

export default bookRouter