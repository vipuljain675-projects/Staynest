const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  homeId: { type: mongoose.Schema.Types.ObjectId, ref: "Home", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  homeName: { type: String, required: true },
  price: { type: Number, required: true },
  
  // 🟢 NEW: GUEST DETAILS
  guests: {
      adults: { type: Number, default: 1 },
      children: { type: Number, default: 0 },
      seniors: { type: Number, default: 0 }
  }
});

module.exports = mongoose.model("Booking", bookingSchema);