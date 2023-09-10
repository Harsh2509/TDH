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
const zod_1 = require("zod");
const jwt = __importStar(require("jsonwebtoken"));
const userAuth_1 = __importDefault(require("../Middlewares/userAuth"));
const index_1 = require("../Database/index");
const router = express_1.default.Router();
const secret = process.env.JWT_SECRET || "ThisIsTemporarySecretInUse";
let userSignupSchema = zod_1.z.object({
    email: zod_1.z.string().email().max(80),
    password: zod_1.z.string().min(8).max(20),
    name: zod_1.z.string().min(3).max(60),
    course: zod_1.z.string().min(2).max(20),
    admissionNo: zod_1.z.number().int(),
    phoneNo: zod_1.z.number().int().gt(1000000000).lt(9999999999),
    branch: zod_1.z.string().min(2).max(50),
    university: zod_1.z.union([zod_1.z.literal("geu"), zod_1.z.literal("gehu")]),
});
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const validationResult = userSignupSchema.safeParse(req.body);
    if (!validationResult.success) {
        return res.json({ error: validationResult.error.flatten() });
    }
    let userDetails = validationResult.data;
    const email = userDetails.email, admissionNo = userDetails.admissionNo;
    const user = yield index_1.User.findOne({ $or: [{ email }, { admissionNo }] });
    if (user) {
        res.status(403).json({
            message: "Email and Admission Number must to unique. Something already exists in database.",
        });
    }
    else {
        const newUser = new index_1.User(userDetails);
        yield newUser.save();
        const token = jwt.sign({ email, role: "user" }, secret, {
            expiresIn: "5h",
        });
        res.json({ message: "User Created successfully", token });
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield index_1.User.findOne({ email });
    if (!user) {
        return res.status(403).json({ message: "User Doesn't Exist." });
    }
    else {
        if (user.password !== password) {
            return res.status(403).json({ message: "Wrong password inputted" });
        }
        const token = jwt.sign({ email, role: "user" }, secret, {
            expiresIn: "5h",
        });
        res.json({ message: "Logged in successfully!", token });
    }
}));
router.get("/test", userAuth_1.default, (req, res) => {
    res.send("You are on a test page. Hope to see you on our website ( •̀ ω •́ )✧");
});
exports.default = router;
