const express = require("express");
const {
  createCollection,
  getCollections,
  getCollectionById,
  updateCollection,
  deleteCollection,
} = require("../controllers/collectionController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Public
router.get("/", getCollections);
router.get("/:id", getCollectionById);

// Admin-only
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  createCollection
);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  updateCollection
);

router.delete("/:id", authMiddleware, adminMiddleware, deleteCollection);

module.exports = router;

