import express from "express";
import { Admin, Event } from "../Database/index";
import * as jwt from "jsonwebtoken";
import { z } from "zod";
import adminAuthentication from "../Middlewares/adminAuth";

const router = express.Router();
const secret = process.env.JWT_SECRET || "ThisIsTemporarySecretInUse";

let adminSignupSchema = z.object({
  name: z.string().min(3).max(60),
  email: z.string().email().max(80),
  password: z.string().min(8),
});

let eventSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().max(2000).min(1),
  img: z.string().url().max(500),
  startDate: z.coerce
    .date()
    .refine((val) => val !== undefined, { message: "start Date is required" }),
  endDate: z.coerce
    .date()
    .refine((val) => val !== undefined, { message: "end Date is required" }),
});

router.post("/signup", async (req, res) => {
  const validationResult = adminSignupSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(403).json({ error: validationResult.error.flatten() });
  }
  const { name, email, password } = validationResult.data;
  const admin = await Admin.findOne({ email });
  if (admin) {
    return res.status(403).json({ message: "Admin is already registered" });
  } else {
    const newAdmin = new Admin({ name, email, password });
    await newAdmin.save();
    const token = jwt.sign({ email, role: "admin" }, secret, {
      expiresIn: "1d",
    });
    return res.json({ message: "Admin created successfully", token });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) {
    res.status(403).json({ message: "Admin Doesn't Exist." });
  } else {
    if (admin.password !== password) {
      return res.status(411).json({ message: "Incorrect password" });
    }
    const token = jwt.sign({ email, role: "admin" }, secret, {
      expiresIn: "1d",
    });
    return res.json({ message: "Logged in successfully!", token });
  }
});

// Admin can add an event to event list. Route: http://localhost:3000/admin/addEvent
router.post("/addEvent", adminAuthentication, async (req, res) => {
  const validationResult = eventSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(403).json({ error: validationResult.error.flatten() });
  }
  const safeEvent = validationResult.data;
  const newEvent = new Event(safeEvent);
  await newEvent.save();
  return res
    .status(200)
    .json({ message: "Event added successfully!", id: newEvent._id });
});

// We can delete an event by providing its id in URL parameter. Route: http://localhost:3000/admin/removeEvent/:id
router.delete("/removeEvent/:id", adminAuthentication, async (req, res) => {
  const id = req.params.id;
  const event = await Event.findByIdAndRemove(id);

  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }
  return res.status(200).json({ message: "Event removed successfully!" });
});

// This route updates an event and returns the updated event details to frontend. Route: http://localhost:3000/admin/updateEvent/:id
router.patch("/updateEvent/:id", adminAuthentication, async (req, res) => {
  const validationResult = eventSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(403).json({ error: validationResult.error.flatten() });
  }
  const safeEvent = validationResult.data;
  const id = req.params.id;
  const event = await Event.findByIdAndUpdate(id, safeEvent);
  if (!event) {
    return res.status(404).json({ message: "Event not found" });
  }

  res
    .status(200)
    .json({ message: "Event updated successfully", updatedEvent: event });
});

// This route gives all the events present in DB to the admin. Route: http://localhost:3000/admin/events
router.get("/events", adminAuthentication, async (req, res) => {
  const events = await Event.find();
  res.status(200).json({ events });
});

export default router;
