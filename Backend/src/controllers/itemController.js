const cloudinary = require("../config/cloudinary");
const Collection = require("../models/Collection");
const Item = require("../models/Item");

const uploadImageIfPresent = (file) =>
  new Promise((resolve, reject) => {
    if (!file) return resolve(null);

    const stream = cloudinary.uploader.upload_stream(
      { folder: "tsedey-activeware/items" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );

    stream.end(file.buffer);
  });

// POST /api/collections/:collectionId/items (admin)
const createItem = async (req, res, next) => {
  try {
    const { name, description, price, inStock } = req.body;
    const { collectionId } = req.params;

    if (!name || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Name and price are required",
      });
    }

    const collection = await Collection.findById(collectionId);
    if (!collection) {
      return res
        .status(404)
        .json({ success: false, message: "Collection not found" });
    }

    const imageUrl = await uploadImageIfPresent(req.file);

    const item = await Item.create({
      collection: collectionId,
      name,
      description,
      price,
      inStock:
        typeof inStock === "string"
          ? inStock === "true"
          : inStock !== undefined
          ? !!inStock
          : true,
      image: imageUrl || undefined,
    });

    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

// GET /api/collections/:collectionId/items (public)
const getItemsByCollection = async (req, res, next) => {
  try {
    const { collectionId } = req.params;
    const items = await Item.find({ collection: collectionId }).sort({
      createdAt: -1,
    });
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};

// GET /api/items/:id (public)
const getItemById = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id).populate(
      "collection",
      "name"
    );
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

// PUT /api/items/:id (admin)
const updateItem = async (req, res, next) => {
  try {
    const { name, description, price, inStock } = req.body;
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    if (name !== undefined) item.name = name;
    if (description !== undefined) item.description = description;
    if (price !== undefined) item.price = price;
    if (inStock !== undefined) {
      item.inStock =
        typeof inStock === "string" ? inStock === "true" : !!inStock;
    }

    if (req.file) {
      const imageUrl = await uploadImageIfPresent(req.file);
      item.image = imageUrl;
    }

    await item.save();
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/items/:id (admin)
const deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    await item.deleteOne();
    res.json({ success: true, message: "Item deleted" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createItem,
  getItemsByCollection,
  getItemById,
  updateItem,
  deleteItem,
};

