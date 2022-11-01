module.exports = function(api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "twrnc-extract",
        {
          twPath: "lib/utils/tw", // default "lib/tw"
        },
      ],
    ],
  };
};
