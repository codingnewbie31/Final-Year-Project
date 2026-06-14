const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "60d" });
};

// @desc Register new user
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, avatar, role } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password, role, avatar });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      token: generateToken(user._id),
      companyName: user.companyName || '',
      companyDescription: user.companyDescription || '',
      companyLogo: user.companyLogo || '',
      resume: user.resume || '',
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
      avatar: user.avatar || '',
      companyName: user.companyName || '',
      companyDescription: user.companyDescription || '',
      companyLogo: user.companyLogo || '',
      resume: user.resume || '',
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get logged-in user
exports.getMe = async (req, res) => {
  res.json({
    message: "User fetched successfully",
    user: req.user
  });
};

// @desc Google OAuth login/register
exports.googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    // 1. Verify the token Google sent us
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const { sub: googleId, email, name, picture } = ticket.getPayload();
    const { role } = req.body;
    
    // 2. Check if user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // New user — create them
      user = await User.create({
        googleId,
        email,
        name,
        avatar: picture,
        role: role || "jobseeker", // default role, they can change later
      });
    } else if (!user.googleId) {
      // Existing email/password user — link Google to their account
      user.googleId = googleId;
      if (!user.avatar) user.avatar = picture;
      await user.save();
    }

    // 3. Return same response format as your login/register
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
      avatar: user.avatar || '',
      companyName: user.companyName || '',
      companyDescription: user.companyDescription || '',
      companyLogo: user.companyLogo || '',
      resume: user.resume || '',
    });

  } catch (err) {
    res.status(401).json({ message: "Google authentication failed" });
  }
};
