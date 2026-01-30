const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");

const signToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role }, // payload
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || "1d" }
  );
};

// ✅ Register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // basic check
    if (!name || !email || !password)
      return res.status(400).json({ message: "Please provide all fields" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    // ⚠️ security note: role shouldn't be freely set by anyone in real app
    const user = await User.create({
      name,
      email,
      password: hashed,
      role: role || "user",
    });

    const token = signToken(user);
    res.status(201).json({
      message: "Registered ✅",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(user);

    res.json({
      message: "Logged in ✅",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
