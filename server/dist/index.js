"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const user_1 = __importDefault(require("./Routes/user"));
const admin_1 = __importDefault(require("./Routes/admin"));
const app = (0, express_1.default)();
dotenv_1.default.config();
const port = process.env.PORT;
const dbURL = process.env.DB_KEY || "mongodb://127.0.0.1:27017/tdh";
mongoose_1.default
    .connect(dbURL)
    .then(() => {
    console.log("MongoDB connection established!");
    app.listen(port, () => {
        console.log(`Server started at http://localhost:${port}`);
    });
})
    .catch((err) => {
    console.log(`Error connecting to database: ${err}`);
});
app.use((0, cors_1.default)()); // To enable Cross Origin Requests
app.use(express_1.default.json()); // To easily parse body in routes.
app.use("/user", user_1.default);
app.use("/admin", admin_1.default);
