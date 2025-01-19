import { polyfillGlobal } from "react-native/Libraries/Utilities/PolyfillFunctions";
import { getRandomValues } from "expo-crypto";

const { TextEncoder, TextDecoder } = require("text-encoding");

polyfillGlobal("TextEncoder", () => TextEncoder);
polyfillGlobal("TextDecoder", () => TextDecoder);
polyfillGlobal("crypto", () => ({ getRandomValues }));
