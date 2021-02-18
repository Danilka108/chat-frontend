// "eslint-config-prettier": "^7.0.0",
//     "eslint-config-standard-with-typescript": "^19.0.1",
//     "eslint-plugin-import": "2.22.1",
//     "eslint-plugin-jsdoc": "30.7.6",
//     "eslint-plugin-node": "^11.1.0",
//     "eslint-plugin-prefer-arrow": "1.2.2",
//     "eslint-plugin-prettier": "^3.3.0",
//     "eslint-plugin-promise": "^4.2.1",
//     "eslint-plugin-standard": "^5.0.0",

module.exports = {
  root: true,  
  overrides: [
    {
      files: ["*.ts"],
      parserOptions: {
        project: [
          "tsconfig.*?.json"
        ],
        createDefaultProgram: true
      },
      extends: ["plugin:@angular-eslint/recommended", "unused-imports"]
    },
    {
      files: ["*.component.html"],
      extends: ["plugin:@angular-eslint/template/recommended"],
      rules: {
        "max-len": ["error", { "code": 140 }]
      }
    },
    {
      files: ["*.component.ts"],
      extends: ["plugin:@angular-eslint/template/process-inline-templates"]
    }
  ]
}