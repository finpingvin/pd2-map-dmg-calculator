// See the Tailwind configuration guide for advanced usage
// https://tailwindcss.com/docs/configuration

module.exports = {
  plugins: [
    require("@tailwindcss/forms"),
  ],
  theme: {
    extend: {
      opacity: {
        "15": 0.15,
      },
    },
  },
};
