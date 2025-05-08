const IS_DEV = process.env.APP_VARIANT === "development";
export default {
  name: IS_DEV ? "Hares (dev)" : "Hares",
  slug: "hares",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "myapp",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: IS_DEV ? "com.lorenzopicoli.hares.dev" : "com.lorenzopicoli.hares",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: IS_DEV ? "com.lorenzopicoli.hares.dev" : "com.lorenzopicoli.hares",
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
    ],
    "expo-sqlite",
    [
      "expo-dev-client",
      {
        launchMode: "most-recent",
        addGeneratedScheme: !!IS_DEV,
      },
    ],
    [
      "expo-document-picker",
      {
        iCloudContainerEnvironment: "Production",
      },
    ],
    "expo-localization",
    "react-native-background-fetch",
    "expo-font",
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {
      origin: false,
    },
    eas: {
      projectId: "5aa36569-53a8-4921-ab47-8d1c8f064e2e",
    },
  },
  owner: "lorenzopicoli",
};
