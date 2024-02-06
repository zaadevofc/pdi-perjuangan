const defaultTheme = require("tailwindcss/defaultTheme");
module.exports = {
  content: ["./views/**/*.ejs"],
  theme: {
    screens: {
      xs: "350px",
      ...defaultTheme.screens,
    },
    fontFamily: {},
    extend: {},
  },
  plugins: [],
};
