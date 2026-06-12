import mongoose from "mongoose";

const unavailableAppointmentDateSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      unique: true,
    },
    reason: {
      type: String,
      maxlength: 250,
      default: "Out of office",
    },
  },
  { timestamps: true }
);

unavailableAppointmentDateSchema.index({ date: 1 }, { unique: true });

export default mongoose.model("UnavailableAppointmentDate", unavailableAppointmentDateSchema);
