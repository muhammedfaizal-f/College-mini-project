const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    // ── Belongs to a provider ─────────────────────────────────────────────────
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Provider",
      required: true,
    },

    // ── Service details ───────────────────────────────────────────────────────
    title: {
      type: String,
      required: [true, "Service title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Plumbing",
        "Electrician",
        "Home Cleaning",
        "Painting",
        "AC Repair",
        "Carpentry",
        "Tutoring",
        "Pet Care",
        "Gardening",
        "Moving Help",
        "Locksmith",
        "Home Cook",
      ],
    },

    subCategory: {
      type: String, // e.g. "Pipe Repair", "Fan Fitting", "Deep Clean"
      default: "",
    },

    // ── Pricing ───────────────────────────────────────────────────────────────
    pricingType: {
      type: String,
      enum: ["hourly", "fixed", "negotiable"],
      default: "hourly",
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },

    // ── Duration estimate ─────────────────────────────────────────────────────
    estimatedDuration: {
      type: Number, // in minutes, e.g. 60
      default: 60,
    },

    // ── Media ─────────────────────────────────────────────────────────────────
    images: {
      type: [String], // array of image URLs
      default: [],
    },

    // ── Tags for search ───────────────────────────────────────────────────────
    tags: {
      type: [String], // e.g. ["leak", "pipe", "emergency"]
      default: [],
    },

    // ── Status ────────────────────────────────────────────────────────────────
    isActive: {
      type: Boolean,
      default: true,
    },

    // ── Popularity ────────────────────────────────────────────────────────────
    bookingCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// ── Text index for full-text search ──────────────────────────────────────────
serviceSchema.index(
  { title: "text", description: "text", tags: "text" },
  { weights: { title: 3, tags: 2, description: 1 } }
);

// ── Index for category filtering ──────────────────────────────────────────────
serviceSchema.index({ category: 1, isActive: 1 });

module.exports = mongoose.model("Service", serviceSchema);