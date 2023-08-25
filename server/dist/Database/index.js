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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = exports.Event = exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var University;
(function (University) {
    University["GEU"] = "geu";
    University["GEHU"] = "gehu";
})(University || (University = {}));
function emailValidator(email) {
    return /^[a-zA-Z0-9_\-]+@[a-zA-Z0-9_\-]+\.[a-zA-Z]{2,4}$/.test(email);
}
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: emailValidator,
            message: "Invalid Email passed to mongoose. (coming from userSchema)",
        },
    },
    password: { type: String, required: true, minLength: 8 },
    course: { type: String, required: true },
    admissionNo: { type: Number, unique: true, required: true },
    certificates: [String],
    phoneNo: { type: Number, required: true, min: 1000000000 },
    events: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Event" }],
    branch: { type: String, required: true },
    university: {
        type: String,
        enum: [University.GEHU, University.GEU],
        required: true,
    },
}, {
    timestamps: true, // To store createdAt and updatedAt
});
const eventSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    img: String,
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
});
const adminSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: emailValidator,
            message: "Invalid Email passed to mongoose. (coming from userSchema)",
        },
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
});
exports.User = mongoose_1.default.model("User", userSchema);
exports.Event = mongoose_1.default.model("Event", eventSchema);
exports.Admin = mongoose_1.default.model("Admin", adminSchema);
