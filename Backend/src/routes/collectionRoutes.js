const express = require("express");
const {
  createCollection,
  getCollections,
  getCollectionById,
  updateCollection,
  deleteCollection,
} = require("../controllers/collectionController");
const adminAuthMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Public
router.get("/", getCollections);
router.get("/:id", getCollectionById);

// Admin-only (requires hardcoded admin login)
router.post(
  "/",
  adminAuthMiddleware,
  upload.single("image"),
  createCollection
);

router.put(
  "/:id",
  adminAuthMiddleware,
  upload.single("image"),
  updateCollection
);

router.delete("/:id", adminAuthMiddleware, deleteCollection);

module.exports = router;

