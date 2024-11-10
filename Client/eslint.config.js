import globals from 'globals';
import pluginReact from 'eslint-plugin-react';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.{js,mjs,cjs,jsx}'],
    languageOptions: {
      globals: globals.browser, // Include browser-specific globals
    },
    plugins: {
      react: pluginReact, // Use the react plugin in the new object format
    },
    settings: {
      react: {
        version: 'detect', // Automatically detect the React version
      },
    },
    rules: {
      // Disable specific rules
      'react/no-unescaped-entities': 0, // Turn off the no-unescaped-entities rule
      'react/prop-types': 0, // Turn off the prop-types validation rule
    },
  },
  pluginReact.configs.flat.recommended, // Apply the recommended React config
];
