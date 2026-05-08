const js = require('@eslint/js')
const globals = require('globals')
const pluginJest = require('eslint-plugin-jest')

module.exports = [
    {
        languageOptions: {
            ecmaVersion: 2020,
            sourceType: 'commonjs',
            globals: {
                ...globals.node,
                ...pluginJest.environments.globals.globals,
            },
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'commonjs',
            },
        },
        plugins: { jest: pluginJest, },
        rules: {
            ...js.configs.recommended.rules,
            'indent': [
                'error',
                4,
                { 'SwitchCase': 1 }
            ],
            'linebreak-style': [
                'error',
                'unix',
            ],
            'quotes': [
                'error',
                'single',
            ],
            'semi': [
                'error',
                'never',
            ],
            'eqeqeq': 'error',
            'no-trailing-spaces': 'error',
            'object-curly-spacing': [
                'error',
                'always',
            ],
            'arrow-spacing': [
                'error',
                {
                    'before': true,
                    'after': true,
                }
            ],
            'no-console': 0,
        },
        settings: {},
        ignores: ['build/*',],
    }
]