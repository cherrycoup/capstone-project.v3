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

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

appointmentSchema.virtual("appointmentId").get(function () {
  const timestamp = this.createdAt || this._id?.getTimestamp?.();
  const date = timestamp ? new Date(timestamp) : new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const suffix = this._id?.toString().slice(-6).toUpperCase() || "000000";

  return `APT-${year}${month}${day}-${suffix}`;
});

appointmentSchema.index({ customerId: 1, createdAt: -1 });
appointmentSchema.index({ date: 1, timeSlot: 1 });

export default mongoose.model("Appointment", appointmentSchema);
