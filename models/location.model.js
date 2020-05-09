const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Location must have a name"] },
  hotels: [{ type: mongoose.Schema.ObjectId, ref: "Hotel" }],
});
