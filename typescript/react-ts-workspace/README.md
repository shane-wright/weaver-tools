# 🧙‍♂️ The Chronicles of the React Realm 🧙‍♂️

*"All we have to decide is what to do with the code that is given to us."*  
— Gandalf the Grey

---

## 🌟 Welcome, Fellow Wanderer of the Code 🌟

"Behold! You have come upon a repository of great significance—a collection of experimental components and code, shaped by the craftsmanship of TypeScript and guided by the wisdom of React. This is no ordinary folder; it is a place of creation and discovery, where ideas are kindled, tested, and honed to perfection."

---

## 🛡️ What Lies Within? 🛡️

Within this hallowed directory, you shall find:

- **⚔️ Experimental Components**: Brave warriors of the UI, crafted to test the boundaries of functionality and design.
- **📜 TypeScript Spells**: Enchantments written in the ancient language of TypeScript, ensuring type safety and clarity.
- **🧪 Test Chambers**: Where components are put to the test, to ensure they are worthy of production.
- **🌌 A Realm of Possibilities**: A place to experiment, innovate, and create without fear of failure.

---

## 🧭 How to Navigate This Realm 🧭

To embark on your journey, follow these steps:

1. **Clone the Repository**:  
```bash
git clone https://github.com/shane-wright/weaver-tools.git
```

2. **Install the Dependancies: @ typescript/react-ts-workspace**: 
```bash
npm install
```

## 🧭 Maps to the realms of men 🧭
```
my-react-app/
├── src/
│   ├── components/       # Your reusable components
│   │   └── Button/
│   │       ├── Button.tsx
│   │       └── index.ts
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
│   └── vite-env.d.ts     # TypeScript declarations for Vite
├── public/               # Static assets
├── index.html            # HTML entry point
├── package.json
├── tsconfig.json
├── vite.config.ts        # Vite configuration
└── .gitignore
```


---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
