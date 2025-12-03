// @ts-check
const eslint = require('@eslint/js');
const angular = require('angular-eslint');
const tseslint = require('typescript-eslint');
const importPlugin = require('eslint-plugin-import');
const unusedImportsPlugin = require('eslint-plugin-unused-imports');
const prettierPlugin = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');

module.exports = tseslint.config(
  {
    ignores: [
      'dist/',
      'tmp/',
      'out-tsc/',
      'bazel-out/',
      'node_modules/',
      '.idea/',
      '.project',
      '.classpath',
      '.c9/',
      '.settings/',
      '.vscode/',
      '!.vscode/settings.json',
      '!.vscode/tasks.json',
      '!.vscode/launch.json',
      '!.vscode/extensions.json',
      '.history/',
      '.angular/cache/',
      '.sass-cache/',
      'connect.lock',
      'coverage/',
      'libpeerconnection.log',
      'testem.log',
      'typings/',
      '.DS_Store',
      'Thumbs.db',
      '*.log',
      '.runtimeconfig.json',
      '.github',
    ],
  },
  {
    // Mark this file as the root of ESLint configuration
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      // @ts-ignore
      ...tseslint.configs.recommended,
      // @ts-ignore
      ...tseslint.configs.stylistic,
      // @ts-ignore
      ...angular.configs.tsRecommended,
      // @ts-ignore
      prettierConfig,
    ],
    // Define the plugins to be used
    plugins: {
      // Plugin for handling imports
      import: importPlugin,
      // Plugin for TypeScript-specific rules
      '@typescript-eslint': tseslint.plugin,
      // Plugin to detect unused imports
      'unused-imports': unusedImportsPlugin,
      // Plugin for Prettier integration
      prettier: prettierPlugin,
    },
    languageOptions: {
      // Specify the parser for TypeScript
      parserOptions: {
        project: ['tsconfig.json', 'tsconfig.spec.json'],
        createDefaultProgram: true,
      },
    },
    processor: angular.processInlineTemplates,
    rules: {
      // Angular rules
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      '@angular-eslint/no-empty-lifecycle-method': ['off'],

      // Import rules
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'import/no-extraneous-dependencies': ['error'],

      // TypeScript rules
      '@typescript-eslint/prefer-readonly': [
        'error',
        {
          onlyInlineLambdas: false,
        },
      ],
      // Defines the order of class members
      '@typescript-eslint/member-ordering': [
        'error',
        {
          default: [
            'static-field',
            'instance-field',
            'static-method',
            'instance-method',
          ],
        },
      ],
      // Allows explicit types for inferrable types
      '@typescript-eslint/no-inferrable-types': [
        'error',
        {
          ignoreParameters: true,
        },
      ],
      // Prohibits the use of require
      '@typescript-eslint/no-var-requires': 'error',
      // Requires specifying the return type in functions
      '@typescript-eslint/explicit-function-return-type': 'error',
      // Naming convention rules for different elements
      '@typescript-eslint/naming-convention': [
        'error',
        {
          // Enum naming rules
          selector: 'enum',
          format: ['PascalCase', 'UPPER_CASE'],
        },
        {
          // Enum member naming rules
          selector: 'enumMember',
          format: ['camelCase', 'UPPER_CASE'],
        },
        {
          // Default rule for all identifiers
          selector: 'default',
          format: ['camelCase'],
        },
        {
          // Rules for constant variables
          selector: 'variable',
          modifiers: ['const'],
          format: ['camelCase', 'UPPER_CASE'],
        },
        {
          // Rules for function parameters
          selector: 'parameter',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
        },
        {
          // Rules for private members
          selector: 'memberLike',
          modifiers: ['private'],
          format: ['camelCase'],
          leadingUnderscore: 'require',
        },
        {
          // Rules for types (interfaces, types, classes)
          selector: 'typeLike',
          format: ['PascalCase'],
        },
        {
          // Rules for boolean variables
          selector: 'variable',
          types: ['boolean'],
          format: ['PascalCase'],
          prefix: ['is', 'should', 'has', 'can', 'did', 'will'],
        },
        {
          // Rules for private boolean properties
          selector: 'property',
          modifiers: ['private'],
          types: ['boolean'],
          format: ['PascalCase'],
          leadingUnderscore: 'require',
          prefix: ['is', 'should', 'has', 'can', 'did', 'will'],
        },
        {
          // Rules for private properties
          selector: 'property',
          modifiers: ['private'],
          format: ['camelCase'],
          leadingUnderscore: 'require',
        },
        {
          // Rules for public properties
          selector: 'property',
          format: ['camelCase', 'snake_case'],
          leadingUnderscore: 'allow',
        },
      ],

      // Prettier rules
      'prettier/prettier': 'error',

      // unused-imports rules
      'unused-imports/no-unused-imports': 'error',

      // General JavaScript/TypeScript rules
      'no-empty-function': 'off',
      // Forces arrow functions without block body when possible
      'arrow-body-style': ['error', 'as-needed'],
      // Forces braces in all control structures
      curly: ['error'],
      // Prohibits specific imports
      'no-restricted-imports': ['error', 'rxjs/Rx'],
      // Controls console usage, allowing only console.error
      'no-console': [
        'warn',
        {
          allow: ['error'],
        },
      ],
      // Prevents switch cases from falling through
      'no-fallthrough': ['error'],
    },
  },
  {
    // Configuration for HTML files
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
      prettierConfig,
    ],
    // HTML template rules
    rules: {},
  },
  {
    // Specific configuration for test files
    files: ['**/*.spec.ts', '**/*.test.ts', '**/*.stub.ts'],
    languageOptions: {
      globals: {
        jasmine: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
      },
    },
    rules: {
      // Allow flexible typing and common test patterns
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/prefer-readonly': 'off',
      '@typescript-eslint/member-ordering': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',

      // Allow empty functions (hooks and helpers)
      'no-empty-function': 'off',
      '@typescript-eslint/no-empty-function': 'off',

      // Relax unused imports/vars in tests
      'unused-imports/no-unused-imports': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      // Allow devDependencies in tests
      'import/no-extraneous-dependencies': 'off',

      // Relax typical "unsafe" rules in tests
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
    },
  }
);
