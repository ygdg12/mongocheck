const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    collection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String, // Cloudinary URL
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", itemSchema);

