/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
	root: true,
	env: {
		"vue/setup-compiler-macros": true,
		node: true,
		browser: true,
		es2021: true,
	},
	"extends": [
		"plugin:vue/vue3-recommended",
		"prettier",
		"eslint-config-prettier",
		"eslint:recommended",
		"plugin:vue/recommended",
		"plugin:prettier-vue/recommended",
	],
	plugins: ["vue", "prettier", "@typescript-eslint", "simple-import-sort", "import"],
	parser: "vue-eslint-parser",
	parserOptions: {
		ecmaVersion: "latest",
		parser: {
			"<template>": "espree",
			js: "@typescript-eslint/parser",
			ts: "@typescript-eslint/parser",
		},
		sourceType: "module",
		createDefaultProgram: true,
		project: ['./tsconfig.json', './tsconfig.node.json', 'tsconfig.app.json'],
		extraFileExtensions: [".vue"],
	},
	rules: {
		"prettier/prettier": "off",
		"vue/multi-word-component-names": "off",
		"vue/no-multiple-template-root": "off",
		"vue/max-attributes-per-line": ["error", {
			"singleline": {
				"max": 3,
			},
			"multiline": {
				"max": 1,
			},
		}],
		"vue/no-mutating-props": ["error", {
			"shallowOnly": false,
		}],
		"simple-import-sort/imports": "error",
		"simple-import-sort/exports": "error",
		"import/first": "error",
		"import/newline-after-import": "error",
	},
};
