const { getDefaultConfig } = require("expo/metro-config");
const { FileStore } = require("metro-cache");
const path = require("node:path");

const projectRoot = __dirname;

const config = getDefaultConfig(projectRoot);

// THIS IS REQUIRED FOR EVOLU AND EFFECT
config.resolver.unstable_enablePackageExports = true;

module.exports = config;
