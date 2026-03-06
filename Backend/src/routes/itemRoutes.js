const express = require("express");
const {
  createItem,
  getItemsByCollection,
  getItemById,
  updateItem,
  deleteItem,
} = require("../controllers/itemController");
const adminAuthMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Public
router.get("/collections/:collectionId/items", getItemsByCollection);
router.get("/items/:id", getItemById);

// Admin-only (requires hardcoded admin login)
router.post(
  "/collections/:collectionId/items",
  adminAuthMiddleware,
  upload.single("image"),
  createItem
);

router.put(
  "/items/:id",
  adminAuthMiddleware,
  upload.single("image"),
  updateItem
);

router.delete("/items/:id", adminAuthMiddleware, deleteItem);

module.exports = router;

