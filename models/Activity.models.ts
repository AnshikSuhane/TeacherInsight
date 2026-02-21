import mongoose, { Schema, Document, Model } from "mongoose";

/* Activity Types */
export type ActivityType =
  | "Lesson Plan"
  | "Quiz"
  | "Question Paper";

/* Interface */
export interface IActivity extends Document {
  teacher: mongoose.Types.ObjectId;
  class: mongoose.Types.ObjectId;

  subject: string;
  activityType: ActivityType;

  createdAt: Date;
  updatedAt: Date;
}

/* Schema */
const ActivitySchema: Schema<IActivity> = new Schema(
  {
    teacher: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      required: true
    },

    class: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true
    },

    subject: {
      type: String,
      required: true,
      trim: true
    },

    activityType: {
      type: String,
      enum: ["Lesson Plan", "Quiz", "Question Paper"],
      required: true
    },

    createdAt: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
);

/* Prevent duplicates */
ActivitySchema.index(
  {
    teacher: 1,
    class: 1,
    subject: 1,
    activityType: 1,
    createdAt: 1
  },
  { unique: true }
);

/* Model */
const Activity: Model<IActivity> =
  mongoose.models.Activity ||
  mongoose.model<IActivity>("Activity", ActivitySchema);

export default Activity;