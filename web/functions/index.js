const { createCustomToken, signUp } = require("./src/auth");
const { upgradePlan } = require("./src/plans");

module.exports = {
  createCustomToken,
  signUp,
  upgradePlan,
};
