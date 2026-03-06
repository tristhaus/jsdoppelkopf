import js from '@eslint/js'
import globals from 'globals'
import { defineConfig } from 'eslint/config'
import pluginCypress from 'eslint-plugin-cypress'
import reactRefresh from 'eslint-plugin-react-refresh'
import react from 'eslint-plugin-react'

export default defineConfig([
    {
        languageOptions: {
            ecmaVersion: 2020,
            globals: {
                ...globals.browser
            },
            parserOptions: {
                ecmaVersion: 'latest',
                ecmaFeatures: { jsx: true },
                sourceType: 'module',
            },
        },
        plugins: {
            react,
            reactRefresh
        },
        extends: [
            pluginCypress.configs.recommended,
        ],
        rules: {
            ...js.configs.recommended.rules,
            ...react.configs.recommended.rules,
            ...react.configs['jsx-runtime'].rules,
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
            'react/prop-types': 0,
            'react/react-in-jsx-scope': 0,
        },
        settings: {
            react: {
                version: 'detect'
            }
        }
    }
])