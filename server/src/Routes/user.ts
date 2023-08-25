import { User } from "../Database/index";
import express from "express";
import * as jwt from "jsonwebtoken";
import userAuthentication from "../Middlewares/userAuth";

const router = express.Router();
const secret = process.env.JWT_SECRET || "ThisIsTemporarySecretInUse";

router.post("/signup", async (req, res) => {
  const {
    email,
    password,
    name,
    course,
    admissionNo,
    phoneNo,
    branch,
    university,
  } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    res.status(403).json({ message: "This email is registered." });
  } else {
    const newUser = new User({
      email,
      password,
      name,
      course,
      admissionNo,
      phoneNo,
      branch,
      university,
    });
    await newUser.save();
    const token = jwt.sign({ email, role: "user" }, secret, {
      expiresIn: "5h",
    });
    res.json({ message: "User Created successfully", token });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (!user) {
    res.status(403).json({ message: "User Doesn't Exist." });
  } else {
    const token = jwt.sign({ email, role: "user" }, secret, {
      expiresIn: "5h",
    });
    res.json({ message: "Logged in successfully!", token });
  }
});

router.get("/test", userAuthentication, (req, res) => {
  res.send("All is well here!");
});

export default router;
