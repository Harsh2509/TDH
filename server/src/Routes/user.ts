import { User } from "../Database/index";
import express from "express";
import * as jwt from "jsonwebtoken";

const router = express.Router();
const secret = process.env.JWT_SECRET || "ThisIsTemporarySecretInUse";

router.post("/signup", async (req, res) => {
  const { email, password, name, course, admissionNo, phoneNo } = req.body;
  const user = await User.findOne({ email, password });
  if (user) {
    res.status(403).json({ message: "User already exist." });
  } else {
    const newUser = new User({
      email,
      password,
      name,
      course,
      admissionNo,
      phoneNo,
    });
    newUser.save();
    const token = jwt.sign({ email, role: "user" }, secret, {
      expiresIn: "5h",
    });
    res.json({ message: "User Created successfully", token });
  }
});

export default router;
