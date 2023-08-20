import mongoose, { Document, Schema } from "mongoose";

enum University {
  GEU = "geu",
  GEHU = "gehu",
}

function emailValidator(email: string): boolean {
  return /^[a-zA-Z0-9_\-]+@[a-zA-Z0-9_\-]+\.[a-zA-Z]{2,4}$/.test(email);
}

interface IUsers extends Document {
  name: string;
  email: string;
  password: string;
  course: string;
  admissionNo: number;
  certificates: string[];
  phoneNo: number;
  events: Array<Schema.Types.ObjectId | IEvents>;
  branch: string;
  university: University;
}

interface IEvents extends Document {
  title: string;
  description?: string;
  img?: string;
  startDate: Date;
  endDate: Date;
}

interface IAdmin extends Document {
  name: string;
  email: string;
  password: string;
}

const userSchema: Schema<IUsers> = new Schema(
  {
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
    events: [{ type: Schema.Types.ObjectId, ref: "Event" }],
    branch: { type: String, required: true },
    university: {
      type: String,
      enum: [University.GEHU, University.GEU],
      required: true,
    },
  },
  {
    timestamps: true, // To store createdAt and updatedAt
  }
);

const eventSchema: Schema<IEvents> = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  img: String,
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
});

const adminSchema: Schema<IAdmin> = new Schema({
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

export const User = mongoose.model("User", userSchema);
export const Event = mongoose.model("Event", eventSchema);
export const Admin = mongoose.model("Admin", adminSchema);
