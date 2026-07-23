const checkAndDowngradeIfExpired = async (user) => {
  if (user.plan !== "free" && user.planExpiresAt && user.planExpiresAt < new Date()) {
    user.plan = "free";
    user.planExpiresAt = null;
    await user.save();
  }
  return user;
};

module.exports = checkAndDowngradeIfExpired;