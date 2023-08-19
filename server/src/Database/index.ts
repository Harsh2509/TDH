import mongoose, { Document, Schema } from "mongoose";

interface IUsers extends Document {
  name: string;
  email: string;
  password: string;
  course: string;
  admissionNo: number;
  certificates: string[];
  phoneNo: number;
  events: object;
}

interface IEvents extends Document {
  title: string;
  description?: string;
  img?: string;
  startDate: Date;
  endDate: Date;
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
        validator: (email: string) => {
          /^[a-zA-Z0-9_\-]+@[a-zA-Z0-9_\-]+\.[a-zA-Z]{2,4}$/.test(email);
        },
        message: "Invalid Email passed to mongoose. (coming from userSchema)",
      },
    },
    password: { type: String, required: true },
    course: { type: String, required: true },
    admissionNo: { type: Number, unique: true, required: true },
    certificates: [String],
    phoneNo: { type: Number, required: true, min: 1000000000 },
    events: [{ type: Schema.Types.ObjectId, ref: "Event" }],
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

export const User = mongoose.model("User", userSchema);
export const Event = mongoose.model("Event", eventSchema);
