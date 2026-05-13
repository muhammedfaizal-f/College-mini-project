const express = require("express");
const router  = express.Router();

const {
  getAllProviders,
  getProviderById,
  getNearbyProviders,
  getMyProviderProfile,
  updateProviderProfile,
  getProviderDashboard,
  toggleAvailability,
} = require("../controllers/providerController");

const { protect, authorize } = require("../middleware/authMiddleware");

// ── Public routes ─────────────────────────────────────────────────────────────
// GET /api/providers?category=Plumbing&city=Coimbatore&sort=rating&page=1
router.get("/",           getAllProviders);

// GET /api/providers/nearby?lat=11.0168&lng=76.9558&radius=10&category=Plumbing
router.get("/nearby",     getNearbyProviders);

// GET /api/providers/:id
router.get("/:id",        getProviderById);

// ── Private routes (provider only) ───────────────────────────────────────────
// GET /api/providers/me  ← own profile
router.get(
  "/me",
  protect,
  authorize("provider", "admin"),
  getMyProviderProfile
);

// PUT /api/providers/me  ← update own profile
router.put(
  "/me",
  protect,
  authorize("provider", "admin"),
  updateProviderProfile
);

// GET /api/providers/me/dashboard  ← stats & earnings
router.get(
  "/me/dashboard",
  protect,
  authorize("provider", "admin"),
  getProviderDashboard
);

// PATCH /api/providers/me/availability  ← quick toggle
router.patch(
  "/me/availability",
  protect,
  authorize("provider", "admin"),
  toggleAvailability
);

module.exports = router;