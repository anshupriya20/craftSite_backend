const PLANS = {
  free: {
    name: "Free",
    price: 0,
    projectLimit: 3,
    durationDays: null, // never expires
  },
  pro: {
    name: "Pro",
    price: 499,           // in your currency's smallest sensible unit, e.g. INR
    projectLimit: Infinity,
    durationDays: 30,      // monthly subscription
  },
  proYearly: {
    name: "Pro (Yearly)",
    price: 4999,
    projectLimit: Infinity,
    durationDays: 365,
  },
};

module.exports = PLANS;