const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// 👇 Add transformer for SVG
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
};

// 👇 Remove svg from asset extensions, add to source extensions
config.resolver = {
  ...config.resolver,
  assetExts: config.resolver.assetExts.filter((ext) => ext !== "svg"),
  sourceExts: [...config.resolver.sourceExts, "svg"],
};

module.exports = config;
