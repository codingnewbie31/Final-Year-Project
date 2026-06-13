const express = require("express");
const { register, login, getMe } = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const { upload } = require("../config/cloudinary");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getMe);

router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  const imageUrl = req.file.path; // Cloudinary returns a permanent URL here
  res.status(200).json({ imageUrl });
});

module.exports = router;