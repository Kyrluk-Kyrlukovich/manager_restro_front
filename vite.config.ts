import { fileURLToPath, URL } from "node:url";

import vue from "@vitejs/plugin-vue";
import visualizer from "rollup-plugin-visualizer";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	return {
		plugins: [vue(), visualizer({ template: "sunburst", filename: "./dist/analyse.html" })],
		resolve: {
			alias: {
				"@": fileURLToPath(new URL("./src", import.meta.url)),
			},
		},
	};
});
