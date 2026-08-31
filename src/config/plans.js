const PLANS = {
  free: {
    name: "Free",
    price: 0,
    projectLimit: 3,
    durationDays: null,
  },
  pro: {
    name: "Pro",
    price: 499,           // ₹499
    priceInPaise: 49900,  // ← Razorpay needs this
    projectLimit: Infinity,
    durationDays: 30,
  },
  proYearly: {
    name: "Pro (Yearly)",
    price: 4999,
    priceInPaise: 499900,
    projectLimit: Infinity,
    durationDays: 365,
  },
};

module.exports = PLANS;