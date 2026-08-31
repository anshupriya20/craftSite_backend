const crypto = require("crypto");
const razorpayInstance = require("../config/razorPay");
const PLANS = require("../config/plans");
const User = require("../models/userModel");

// ── Step 1: Create an order before opening the checkout widget ──
const createOrder = async (req, res, next) => {
  try {
    const { planKey } = req.body;
    const plan = PLANS[planKey];

    if (!plan || !plan.priceInPaise) {
      return res.status(400).json({ message: "Invalid plan selected" });
    }

    const order = await razorpayInstance.orders.create({
      amount: plan.priceInPaise,
      currency: "INR",
      receipt: `receipt_${req.user.id}_${Date.now()}`,
      notes: {
        userId: req.user.id,
        planKey,
      },
    });

    res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    next(error);
  }
};

// ── Step 2: Verify payment signature after checkout succeeds, then activate the plan ──
const verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planKey } = req.body;

    const plan = PLANS[planKey];
    if (!plan) {
      return res.status(400).json({ message: "Invalid plan" });
    }

    // Recreate the signature Razorpay expects, using our secret key.
    // If it matches what the client sent, the payment is genuinely verified —
    // this is what makes it safe to trust without a webhook.
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // Signature valid — activate the plan
    const now = new Date();
    const expiresAt = plan.durationDays
      ? new Date(now.getTime() + plan.durationDays * 24 * 60 * 60 * 1000)
      : null;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        plan: planKey,
        planStartedAt: now,
        planExpiresAt: expiresAt,
      },
      { new: true }
    ).select("-password");

    res.status(200).json({ message: "Payment verified, plan activated", user });
  } catch (error) {
    next(error);
  }
};

module.exports = { createOrder, verifyPayment };