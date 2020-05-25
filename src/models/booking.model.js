const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  bookingDate: String,
  expiration: String,
  amount: Number,
  paymentType: {
    type: String,
    enum: ["visa", "mtn momo", "airtel money", "mastercard", "paypal"],
  },
  user: { type: mongoose.Schema.ObjectId, ref: "User" },
  hotel: { type: mongoose.Schema.ObjectId, ref: "Hotel" },
});

export default mongoose.model("Booking", bookingSchema)
