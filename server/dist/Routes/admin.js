"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = require("../Database/index");
const jwt = __importStar(require("jsonwebtoken"));
const zod_1 = require("zod");
const router = express_1.default.Router();
const secret = process.env.JWT_SECRET || "ThisIsTemporarySecretInUse";
let adminSignupSchema = zod_1.z.object({
    name: zod_1.z.string().min(3).max(60),
    email: zod_1.z.string().email().max(80),
    password: zod_1.z.string().min(8),
});
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validationResult = adminSignupSchema.safeParse(req.body);
    if (!validationResult.success) {
        return res.status(403).json({ error: validationResult.error.flatten() });
    }
    const { name, email, password } = validationResult.data;
    const admin = yield index_1.Admin.findOne({ email });
    if (admin) {
        res.status(403).json({ message: "Admin is already registered" });
    }
    else {
        const newAdmin = new index_1.Admin({ name, email, password });
        yield newAdmin.save();
        const token = jwt.sign({ email, role: "admin" }, secret, {
            expiresIn: "1d",
        });
        res.json({ message: "Admin created successfully", token });
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const admin = yield index_1.Admin.findOne({ email, password });
    if (!admin) {
        res.status(403).json({ message: "Admin Doesn't Exist." });
    }
    else {
        const token = jwt.sign({ email, role: "admin" }, secret, {
            expiresIn: "1d",
        });
        res.json({ message: "Logged in successfully!", token });
    }
}));
exports.default = router;
