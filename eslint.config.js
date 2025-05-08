// import js from "@eslint/js";
// import globals from "globals";
// import pluginReact from "eslint-plugin-react";
// import { defineConfig } from "eslint/config";

// export default defineConfig([
//   { 
//     files: ["**/*.{js,mjs,cjs,jsx}"], 
//     plugins: { 
//       js,
//       "custom-rules": {
//         rules: {
//           "require-button-component": {
//             meta: {
//               type: "suggestion",
//               docs: {
//                 description: "Enforce using <Button> component instead of native <button>",
//                 recommended: true,
//               },
//               fixable: "code",
//             },
//             create(context) {
//               return {
//                 JSXOpeningElement(node) {
//                   if (node.name.name === 'Button') {
//                     context.report({
//                       node,
//                       message: "Use <Button> component instead of native <button>",
//                       fix(fixer) {
//                         return fixer.replaceText(node.name, 'button');
//                       },
//                     });
//                   }
//                 }
//               };
//             },
//           },
//         },
//       },
//     }, 
//     extends: ["js/recommended"] 
//   },
//   { 
//     files: ["**/*.{js,mjs,cjs,jsx}"], 
//     languageOptions: { 
//       globals: {...globals.browser, ...globals.node},
//       parserOptions: {
//         ecmaFeatures: {
//           jsx: true,
//         },
//         ecmaVersion: "latest",
//         sourceType: "module",
//       },
//     } 
//   },
//   pluginReact.configs.flat.recommended,
//   {
//     files: ["**/*.jsx"],
//     rules: {
//       "custom-rules/require-button-component": "warn", // Changed from "error" to "warn"
//     },
//   },
// ]);