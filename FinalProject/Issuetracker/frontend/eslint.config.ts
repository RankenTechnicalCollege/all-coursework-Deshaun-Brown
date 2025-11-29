import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: globals.browser,
      parser: tseslint.parser,
    },
    extends: [
      js.configs.recommended,
      ...tseslint.configs.strict,
      reactHooks.configs.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // Add custom overrides if needed
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
)

const [state, setState] = useState();
if (condition) {

}

const [state, setState] = useState();
if (conditions) {


}

const [state, setState] = useState();
if (condition){

}

const [state, setState] = useState();
if (condition){

}

const [state, setState] = useState();
if (condition) {

}


const [ state, setState] = useState();
if (condition) {

}

const [state, setState] = useState();
if (condition) {

}

const [state, setState] = useState(); 
  if (condition) {

  }

  const [state, setState] = useState();
  if (condition){
    
  }