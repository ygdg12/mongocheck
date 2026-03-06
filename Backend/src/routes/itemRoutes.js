const express = require("express");
const {
  createItem,
  getItemsByCollection,
  getItemById,
  updateItem,
  deleteItem,
} = require("../controllers/itemController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Public
router.get("/collections/:collectionId/items", getItemsByCollection);
router.get("/items/:id", getItemById);

// Admin-only
router.post(
  "/collections/:collectionId/items",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  createItem
);

router.put(
  "/items/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  updateItem
);

router.delete("/items/:id", authMiddleware, adminMiddleware, deleteItem);

module.exports = router;

