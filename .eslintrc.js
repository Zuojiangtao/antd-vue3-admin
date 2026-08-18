/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
    sourceType: 'module',
    jsxPragma: 'React',
    ecmaFeatures: {
      jsx: true,
      tsx: true,
    },
  },
  extends: ['plugin:vue/vue3-recommended', 'plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  rules: {
    // js
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // prettier
    'prettier/prettier': [
      2,
      {
        usePrettierrc: true,
      },
    ],
    // vue
    'vue/max-attributes-per-line': [
      2,
      {
        singleline: 5,
        multiline: 1,
      },
    ],
    'vue/attribute-hyphenation': 0,
    'vue/component-name-in-template-casing': 0,
    'vue/html-closing-bracket-spacing': 0,
    'vue/singleline-html-element-content-newline': 0,
    'vue/script-setup-uses-vars': 2,
    'vue/no-unused-components': 0,
    'vue/multiline-html-element-content-newline': 0,
    'vue/no-use-v-if-with-v-for': 0,
    'vue/html-closing-bracket-newline': 0,
    'vue/no-parsing-error': 0,
    'vue/multi-word-component-names': 0,
    'vue/no-mutating-props': 0,
    'vue/custom-event-name-casing': 0,
    'vue/attributes-order': 0,
    'vue/one-component-per-file': 0,
    'vue/require-default-prop': 0,
    'vue/require-explicit-emits': 0,
    'vue/html-self-closing': [
      2,
      {
        html: {
          void: 'always',
          // normal: 'never',
          component: 'always',
        },
        svg: 'always',
        math: 'always',
      },
    ],
    // ts
    '@typescript-eslint/ban-ts-ignore': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/no-empty-function': 0,
    '@typescript-eslint/no-use-before-define': 0,
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/ban-types': 0,
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
  },
  overrides: [
    {
      // 业务页面代码：强制使用 unplugin-auto-import，禁止手动导入已自动注入的模块
      // （stores/layouts/hooks/utils 等历史目录存在大量手动导入，待逐步迁移后再扩大范围）
      files: ['src/views/**/*.vue', 'src/views/**/*.ts', 'src/views/**/*.tsx'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            paths: [
              { name: 'vue', message: '已由 unplugin-auto-import 自动导入，禁止手动 import（详见 .codebuddy/rules/type_components_import.mdc）', },
              { name: 'vue-router', message: '已由 unplugin-auto-import 自动导入，禁止手动 import', },
              { name: 'pinia', message: '已由 unplugin-auto-import 自动导入，禁止手动 import', },
              { name: 'axios', message: '已由 unplugin-auto-import 自动导入（默认导出 axios）', },
            ],
            patterns: [
              {
                group: ['@/hooks/*', '@/hooks/**', '@/components/*', '@/components/**'],
                message: '项目 hooks 与公共组件已由 unplugin-auto-import 自动导入，禁止手动 import',
              },
            ],
          },
        ],
      },
    },
  ],
};
