const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  checkIn: Date,
  checkOut: Date,
  totalPrice: Number,
  status: { type: String, default: 'confirmed' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);