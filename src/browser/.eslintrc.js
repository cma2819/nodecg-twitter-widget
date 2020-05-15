module.exports = {
    root: true,
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: '@typescript-eslint/parser',
        project: './tsconfig.json',
        sourceType: 'module',
        extraFileExtensions: ['.vue']
    },
    env: {
        es6: true,
        browser: true
    },
    plugins: [
        'vue'
    ],
    extends: [
        'plugin:vue/recommended',
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/typescript',
    ],
    rules: {
        'vue/html-self-closing': ['error', {
            html: {
                normal: 'never',
                component: 'never'
            }
        }],
        'quotes': ['error', 'single']
    }
};