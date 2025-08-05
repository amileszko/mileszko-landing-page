export default {
  build: { content: ["src/templates/emails/**/*.html"] },
  components: { root: "./src/templates" },
  css: {
    inline: { removeInlinedSelectors: false },
    shorthand: true,
  },
  prettify: true,
};
