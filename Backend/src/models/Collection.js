const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String, // Cloudinary URL
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Optional: ensure unique name per admin
collectionSchema.index({ name: 1, createdBy: 1 }, { unique: true });

module.exports = mongoose.model("Collection", collectionSchema);

