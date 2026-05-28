module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"], //  ¡El preset correcto para Expo!
    plugins: [
      [
        "module:react-native-dotenv",
        {
          envName: "APP_ENV",
          moduleName: "@env",
          path: ".env",
        },
      ],
    ],
  };
};
