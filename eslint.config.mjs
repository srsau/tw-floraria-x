import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
  {
    files: ['**/*.js'],
    languageOptions: { sourceType: 'commonjs' },
  },

  {
    languageOptions: {
      globals: {
        ...globals.browser,
        __dirname: true,
        obGlobal: true,
        process: true,
        __filename: true,
      },
    },
  },
  pluginJs.configs.recommended,
  {
    rules: {
      'no-undef': 'warn',
    },
  },
];
