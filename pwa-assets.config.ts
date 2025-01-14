import type { Preset } from "@vite-pwa/assets-generator/config";
import { defineConfig, minimal2023Preset } from "@vite-pwa/assets-generator/config";

export const minimalPresetNoPadding: Preset = {
  transparent: {
    ...minimal2023Preset.transparent,
    padding: 0,
  },
  maskable: {
    ...minimal2023Preset.maskable,
    padding: 0,
  },
  apple: {
    ...minimal2023Preset.apple,
    padding: 0,
  },
};

export default defineConfig({
  headLinkOptions: {
    preset: "2023",
  },
  preset: {
    ...minimal2023Preset,
    ...minimalPresetNoPadding,
  },
  images: ["public/logo.svg"],
});
