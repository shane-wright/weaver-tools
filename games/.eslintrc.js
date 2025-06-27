module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    // Allow console statements for game development
    'no-console': 'off',
    
    // Allow function hoisting for game functions
    'no-use-before-define': ['error', { functions: false }],
    
    // Allow shorter variable names for game coordinates
    'id-length': 'off',
    
    // Allow for-of loops for game arrays
    'no-restricted-syntax': 'off',
    
    // Allow plusplus for game loops
    'no-plusplus': 'off',
    
    // Allow continue in loops
    'no-continue': 'off',
    
    // Allow assignment in conditions for game logic
    'no-cond-assign': 'off',
    
    // Allow reassigning function parameters for game objects
    'no-param-reassign': 'off',
    
    // Relax some rules for game development
    'prefer-const': 'warn',
    'no-unused-vars': 'warn',
  },
  globals: {
    // Canvas and game-related globals
    canvas: 'readonly',
    ctx: 'readonly',
    requestAnimationFrame: 'readonly',
    Image: 'readonly',
  },
};
