import express from "express"
import authController from "../controllers/authController.js"
import upload from "../middleware/imageUploadMiddleware.js"
import protect from "../middleware/authMiddleware.js"

const router = express.Router()


router.post("/register", authController.registerUser)
router.post("/login", authController.loginUser)
router.post("/private", protect.forAdmin, authController.privateController)
router.put("/update-profile", protect.forAuthUsers, authController.updateUserProfile)


export default router