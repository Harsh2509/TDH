import express from "express";
import { z } from "zod";
import * as jwt from "jsonwebtoken";
import userAuthentication from "../Middlewares/userAuth";
import { User } from "../Database/index";

const router = express.Router();
const secret = process.env.JWT_SECRET || "ThisIsTemporarySecretInUse";

let userSignupSchema = z.object({
  email: z.string().email().max(80),
  password: z.string().min(8).max(20),
  name: z.string().min(3).max(60),
  course: z.string().min(2).max(20),
  admissionNo: z.number().int(),
  phoneNo: z.number().int().gt(1000000000).lt(9999999999),
  branch: z.string().min(2).max(50),
  university: z.union([z.literal("geu"), z.literal("gehu")]),
});

router.post("/signup", async (req, res) => {
  const validationResult = userSignupSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.json({ error: validationResult.error.flatten() });
  }
  let userDetails = validationResult.data;

  const email = userDetails.email,
    admissionNo = userDetails.admissionNo;
  const user = await User.findOne({ $or: [{ email }, { admissionNo }] });
  if (user) {
    res.status(403).json({
      message:
        "Email and Admission Number must to unique. Something already exists in database.",
    });
  } else {
    const newUser = new User(userDetails);
    await newUser.save();
    const token = jwt.sign({ email, role: "user" }, secret, {
      expiresIn: "5h",
    });
    res.json({ message: "User Created successfully", token });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(403).json({ message: "User Doesn't Exist." });
  } else {
    if (user.password !== password) {
      return res.status(403).json({ message: "Incorrect Password" });
    }
    const token = jwt.sign({ email, role: "user" }, secret, {
      expiresIn: "5h",
    });
    res.json({ message: "Logged in successfully!", token });
  }
});

router.get("/test", userAuthentication, (req, res) => {
  res.send("You are on a test page. Hope to see you on our website ( •̀ ω •́ )✧");
});

export default router;
