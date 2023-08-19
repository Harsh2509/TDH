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
const index_1 = require("../Database/index");
const express_1 = __importDefault(require("express"));
const jwt = __importStar(require("jsonwebtoken"));
const router = express_1.default.Router();
const secret = process.env.JWT_SECRET || "ThisIsTemporarySecretInUse";
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name, course, admissionNo, phoneNo } = req.body;
    const user = yield index_1.User.findOne({ email, password });
    if (user) {
        res.status(403).json({ message: "User already exist." });
    }
    else {
        const newUser = new index_1.User({
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
}));
exports.default = router;
