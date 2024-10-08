module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: ["eslint:recommended", "google", "prettier"],
  rules: {
    quotes: ["error", "double"],
  },
  parser: "babel-eslint",
};
