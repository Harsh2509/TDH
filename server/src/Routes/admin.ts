import express from "express";
import { Admin } from "../Database/index";
import * as jwt from "jsonwebtoken";
import { z } from "zod";
import adminAuthentication from "../Middlewares/adminAuth";

const router = express.Router();
const secret = process.env.JWT_SECRET || "ThisIsTemporarySecretInUse";

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (admin) {
    res.status(403).json({ message: "Admin is already registered" });
  } else {
    const newAdmin = new Admin({ name, email, password });
    await newAdmin.save();
    const token = jwt.sign({ email, role: "admin" }, secret, {
      expiresIn: "1d",
    });
    res.json({ message: "Admin created successfully", token });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email, password });
  if (!admin) {
    res.status(403).json({ message: "Admin Doesn't Exist." });
  } else {
    const token = jwt.sign({ email, role: "admin" }, secret, {
      expiresIn: "1d",
    });
    res.json({ message: "Logged in successfully!", token });
  }
});

export default router;
