const mongoose = require("mongoose");

const hotelSchema = mongoose.Schema({
  name: { type: String, required: [true, "Provide the Hotel name"] },
  location: { type: String, required: [true, "Provide the Hotel location"] },
  address: { type: String, required: [true, "Provide the Hotel address"] },
  region: { type: String, required: [true, "Provide the Hotel region"] },
  images: { type: [String] },
  coverImage: { type: String },
  description: {
    type: String,
    required: [true, "Provide the Hotel description"],
  },
  summary: { type: String, required: [true, "Provide the Hotel summary"] },
  facilities: { type: [String] },
  languages: { type: [String] },
  availability: Boolean,
  prices: String,
  avgPrice: String,
  rating: Number,
  reviews: [String],
  rules: [String],
});

module.exports = mongoose.model("Hotel", hotelSchema);
