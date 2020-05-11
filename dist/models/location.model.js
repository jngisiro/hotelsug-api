"use strict";

var mongoose = require("mongoose");

var LocationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Location must have a name"],
    unique: true
  },
  imageUrl: String
});
LocationSchema.virtual("hotels", {
  ref: "Hotel",
  foreignField: "location",
  localField: "_id"
});
module.exports = mongoose.model("Location", LocationSchema);