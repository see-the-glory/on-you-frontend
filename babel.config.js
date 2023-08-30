module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "react-native-reanimated/plugin",
      "react-native-iconify/plugin",
      [
        "module-resolver",
        {
          root: ["./src"],
          extensions: [".ios.js", ".android.js", ".js", ".ts", ".tsx", ".json"],
          alias: {
            "@fonts": "./assets/fonts",
            "@images": "./assets/images",
            "@lottie": "./assets/lottie",
            "@components": "./src/components",
            "@navigation": "./src/navigation",
          },
        },
      ],
    ],
  };
};
