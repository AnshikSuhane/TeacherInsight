import mongoose, { Schema, Document, Model } from "mongoose";

export interface IClass extends Document {
  grade: number;
  createdAt: Date;
  updatedAt: Date;
}

const ClassSchema: Schema<IClass> = new Schema(
  {
    grade: {
      type: Number,
      required: true,
      unique: true,
      min: 1,
      max: 12
    }
  },
  { timestamps: true }
);

const ClassModel: Model<IClass> =
  mongoose.models.Class ||
  mongoose.model<IClass>("Class", ClassSchema);

export default ClassModel;