const express = require("express");

const {
    getTasks,
    postTasks,
    updateTask,
    deleteTask
} = require("../controllers/taskControllers");

const authMiddleware = require("../middleware/authMiddleware");
const uploadMiddleware = require("../middleware/uploadMiddleware");


const router = express.Router();

// Public routes
router.post("/postTasks",authMiddleware, uploadMiddleware, postTasks);
router.get("/getTasks",authMiddleware, getTasks);
router.put("/:id", authMiddleware, uploadMiddleware, updateTask);
router.delete("/:id", authMiddleware, deleteTask);

// Protected routes go here
// router.get("/profile", authMiddleware, profileController);

module.exports = router;