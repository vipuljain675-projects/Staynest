const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  homeId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Home"
  },
  homeName: { type: String, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  
  // 🟢 NEW: GUEST DETAILS
  guests: {
    adults: { type: Number, required: true, default: 1 },
    children: { type: Number, required: true, default: 0 },
    seniors: { type: Number, required: true, default: 0 }
  }
});

module.exports = mongoose.model("Booking", bookingSchema);