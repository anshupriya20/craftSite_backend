const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    plan: {
      type: String,
      enum: ["pro", "proYearly"],
      required: true,
    },

    provider: {
      type: String,
      enum: ["razorpay", "stripe"],
      required: true,
    },

    providerSubscriptionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    providerCustomerId: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: [
        "created",
        "trialing",
        "active",
        "past_due",
        "cancelled",
        "completed",
        "halted",
        "expired",
      ],
      default: "created",
    },

    amount: {
      type: Number,
      default: 0,
    },

    currency: {
      type: String,
      default: "INR",
    },

    interval: {
      type: String,
      enum: ["monthly", "yearly"],
      required: true,
    },

    currentPeriodStart: {
      type: Date,
      default: null,
    },

    currentPeriodEnd: {
      type: Date,
      default: null,
    },

    cancelAtPeriodEnd: {
      type: Boolean,
      default: false,
    },

    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Subscription",
  subscriptionSchema
);