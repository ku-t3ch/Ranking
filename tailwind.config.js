module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        BaseGreen: "#006664",
        BaseGreenBaiTong: "#2BB1E",
        BaseGrey: "#74787B", // Corrected color code
        BaseBrown: "#6E4B32",
        BaseYellow: "#FFD80D",
        BaseBlack: "#222221",
        BaseBlackGround : "#111827"
      },
      screens: {
        'xs': '300px', // Set a custom screen width less than 'sm'
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
      },
    },
  },
  plugins: [],
};
