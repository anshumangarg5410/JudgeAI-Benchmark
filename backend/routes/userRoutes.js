const express = require("express");
const router = express.Router();
const { getUsers, createUser } = require("../controllers/userController");
const { loginUser, registerUser, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Auth routes
router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/me", protect, getMe);

// Management routes (Ideally protected by admin middleware later)
router.get("/", getUsers);
router.post("/", createUser);

module.exports = router;
