const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  location: String,
  images: [String],
  category: String,
  guests: Number,
  bedrooms: Number,
  bathrooms: Number,
  amenities: [String],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Listing', listingSchema);
