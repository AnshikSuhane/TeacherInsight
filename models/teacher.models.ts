import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITeacher extends Document {
  teacherId: string;
  name: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TeacherSchema: Schema<ITeacher> = new Schema(
  {
    teacherId: {
      type: String,
      required: true,
      unique: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String
    }
  },
  { timestamps: true }
);

const Teacher: Model<ITeacher> =
  mongoose.models.Teacher ||
  mongoose.model<ITeacher>("Teacher", TeacherSchema);

export default Teacher;