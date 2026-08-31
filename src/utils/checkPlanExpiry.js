const checkAndDowngradeIfExpired = async (user) => {
  if (user.plan !== "free" && user.planExpiresAt && user.planExpiresAt < new Date()) {
    user.plan = "free";
    user.planExpiresAt = null;
    await user.save();
  }
  return user;
};

module.exports = checkAndDowngradeIfExpired;

// const checkAndDowngradeIfExpired = async (user) => {
//   if (
//     user.plan !== "free" &&
//     user.planExpiresAt &&
//     user.planExpiresAt < new Date()
//   ) {
//     user.plan = "free";

//     user.planSource = "free";

//     user.planStartedAt = null;
//     user.planExpiresAt = null;

//     user.autoRenew = false;

//     user.paymentProvider = null;
//     user.paymentCustomerId = null;
//     user.paymentSubscriptionId = null;

//     user.subscriptionStatus = "expired";

//     user.cancelAtPeriodEnd = false;
//     user.cancelledAt = null;

//     await user.save();
//   }

//   return user;
// };

// module.exports = checkAndDowngradeIfExpired;