import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true
  },

  service: {
    type: String,
    required: true
  },

  date: {
    type: Date,
    required: true
  },

  timeSlot: {
    type: String,
    required: true
  },

  contactInfo: {
    name: String,
    email: String,
    phone: String
  },

  notes: String,

  status: {
    type: String,
    enum: ["Scheduled", "Confirmed", "Completed", "Cancelled"],
    default: "Scheduled"
  }

}, { timestamps: true });

appointmentSchema.index({ customerId: 1, createdAt: -1 });
appointmentSchema.index({ date: 1, timeSlot: 1 });

export default mongoose.model("Appointment", appointmentSchema);
