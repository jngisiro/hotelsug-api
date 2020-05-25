import mongoose from "mongoose";

const favSchema = new mongoose.Schema({
  hotel: { type: mongoose.Schema.ObjectId, ref: "Hotel" },
  user: { type: mongoose.Schema.ObjectId, ref: "User" },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

export default mongoose.model("Favs", favSchema);
