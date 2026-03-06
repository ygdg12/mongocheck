const cloudinary = require("../config/cloudinary");
const Collection = require("../models/Collection");
const Item = require("../models/Item");

// Helper to upload an optional image buffer to Cloudinary
const uploadImageIfPresent = (file) =>
  new Promise((resolve, reject) => {
    if (!file) return resolve(null);

    const stream = cloudinary.uploader.upload_stream(
      { folder: "tsedey-activeware/collections" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );

    stream.end(file.buffer);
  });

// POST /api/collections  (admin)
const createCollection = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Name is required" });
    }

    const imageUrl = await uploadImageIfPresent(req.file);

    const collection = await Collection.create({
      name,
      description,
      image: imageUrl || undefined,
    });

    res.status(201).json({ success: true, data: collection });
  } catch (err) {
    next(err);
  }
};

// GET /api/collections (public)
const getCollections = async (req, res, next) => {
  try {
    const collections = await Collection.find()
      .populate("createdBy", "email role")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: collections });
  } catch (err) {
    next(err);
  }
};

// GET /api/collections/:id (public)
const getCollectionById = async (req, res, next) => {
  try {
    const collection = await Collection.findById(req.params.id).populate(
      "createdBy",
      "email role"
    );
    if (!collection) {
      return res
        .status(404)
        .json({ success: false, message: "Collection not found" });
    }

    res.json({ success: true, data: collection });
  } catch (err) {
    next(err);
  }
};

// PUT /api/collections/:id (admin)
const updateCollection = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const collection = await Collection.findById(req.params.id);
    if (!collection) {
      return res
        .status(404)
        .json({ success: false, message: "Collection not found" });
    }

    if (name !== undefined) collection.name = name;
    if (description !== undefined) collection.description = description;

    if (req.file) {
      const imageUrl = await uploadImageIfPresent(req.file);
      collection.image = imageUrl;
    }

    await collection.save();
    res.json({ success: true, data: collection });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/collections/:id (admin)
const deleteCollection = async (req, res, next) => {
  try {
    const collection = await Collection.findById(req.params.id);
    if (!collection) {
      return res
        .status(404)
        .json({ success: false, message: "Collection not found" });
    }

    // Remove related items
    await Item.deleteMany({ collection: collection._id });
    await collection.deleteOne();

    res.json({ success: true, message: "Collection deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createCollection,
  getCollections,
  getCollectionById,
  updateCollection,
  deleteCollection,
};

