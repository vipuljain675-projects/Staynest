const mongoose = require('mongoose');

const homeSchema = new mongoose.Schema({
  houseName: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  rating: { type: Number, required: true },
  
  // 🔴 CHANGE THIS LINE:
  // FROM: photoUrl: { type: String, required: true },
  // TO:
  photoUrl: [{ type: String }], // It is now an Array of Strings

  description: { type: String, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Home', homeSchema);