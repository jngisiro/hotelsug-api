import mongoose from "mongoose";

const favouriteSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  hotel: { type: mongoose.Schema.ObjectId, ref: "Hotel" },
  user: { type: mongoose.Schema.ObjectId, ref: "User" },
});

export default mongoose.model("Favourite", favouriteSchema);
