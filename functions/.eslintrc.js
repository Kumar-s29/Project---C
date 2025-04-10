module.exports = {
  env: {
    node: true, // ✅ Enables Node.js global variables
    es2020: true,
  },
  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    // Optional: Add or remove ESLint rules
  },
};
