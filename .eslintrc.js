module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es2020: true,
		jest: true,
	},
	extends: "eslint:recommended",
	parserOptions: {
		ecmaVersion: 11,
	},
	rules: {
		indent: ["error", "tab"],
		"linebreak-style": ["error", "windows"],
		quotes: ["error", "double"],
		semi: ["error", "always"],
		eqeqeq: "error",
		"no-trailing-spaces": "error",
		"object-curly-spacing": ["error", "always"],
		"arrow-spacing": ["error", { before: true, after: true }],
		"no-console": 0,
		"no-unused-vars": ["error", { varsIgnorePattern: "^_" }],
	},
};
