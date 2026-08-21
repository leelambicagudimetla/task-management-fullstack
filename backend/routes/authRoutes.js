const express = require("express");

const {
    registerController,
    loginController,
    meController
} = require("../controllers/authControllers");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/register", registerController);
router.post("/login", loginController);

// Protected routes go here
// router.get("/profile", authMiddleware, profileController);
router.get("/me", authMiddleware, meController);

module.exports = router;