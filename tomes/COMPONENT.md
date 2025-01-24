# 🧙‍♂️ The Tome of Component Creation 🧙‍♂️

**Hark, brave developer!** You seek to add a new component to the realm. This is no small task, but with this tome as your guide, you shall prevail. Follow these steps with care, for the path is fraught with peril, and the senior architects... well, they are not always as helpful as one might hope.

---

## 🛠 Step One: Generate the Component

Begin by invoking the sacred Nx command to summon a new component into existence:

```bash
nx generate @nx/react:component --name <NAME OF COMPONENT> --path ./libs/ui/src/lib/<NAME OF COMPONENT>
```

Alas, this command is not as reliable as the legends claim. You must take matters into your own hands.

---

## 🚧 Step Two: Move the Component

The component shall appear in the wrong location, as if placed there by a mischievous hobbit. You must move it manually:

1. Navigate to `./libs/ui/src/lib/<NAME OF COMPONENT>`.
2. Relocate the component to its rightful home at `./libs/src/lib/<NAME OF COMPONENT>`.

---

## 🧹 Step Three: Purge the CSS

The generated CSS file is an abomination, a lazy shortcut unworthy of your craftsmanship. You must purge it and embrace the path of righteousness:

1. Delete the generated CSS file (`<NAME OF COMPONENT>.module.css`).
2. Embed your styles directly within the component, as a true developer of honor would do.

---

## 🧪 Step Four: Create a Unit Test

A component without tests is like a sword without a blade—useless in battle. You must forge a unit test using Jest:

1. Create a new file named `<NAME OF COMPONENT>.spec.tsx` in the component's directory.
2. Write tests to ensure your component behaves as expected.

---

## 📖 Step Five: Craft a Storybook Story

To showcase your component in Storybook, you must create a story:

1. Create a new file named `<NAME OF COMPONENT>.stories.tsx` in the component's directory.
2. Write a story that demonstrates the component's use and variations.

---

## 📜 Step Six: Register the Component

Your component must be acknowledged by the realm. To do this, you must register it in the sacred index file:

1. Open `./libs/ui/src/index.ts`.
2. Add the following line to export your component:

   ```typescript
   export { default as <NAME OF COMPONENT> } from './lib/<NAME OF COMPONENT>/<NAME OF COMPONENT>';
   ```

---

## 🏰 Step Seven: Import the Component

Finally, you must summon your component into the desired page:

1. Navigate to the page where the component shall reside, e.g., `./apps/client/src/app/pages/pagename.tsx`.
2. Import the component like so:

   ```typescript
   import { <NAME OF COMPONENT> } from '@TVA/libs-ui';
   ```

3. Use the component in your page as needed.

---

## 🌟 A Final Word

You have now completed the sacred ritual of component creation. May your code be clean, your tests pass, and your components shine brightly in the annals of this repository. Remember, the road is long, but with this tome as your guide, you shall not falter.

**HARK A SECRET MAP!** 🧙‍♂️✨
📁 libs
   └── 📁 ui
       └── 📁 src
           ├── 📁 lib
           │   └── 📁 <NAME OF COMPONENT>
           │       ├── 📄 <NAME OF COMPONENT>.tsx
           │       ├── 📄 <NAME OF COMPONENT>.spec.tsx
           │       └── 📄 <NAME OF COMPONENT>.stories.tsx
           └── 📄 index.ts
📁 apps
   └── 📁 client
       └── 📁 src
           └── 📁 app
               └── 📁 pages
                   └── 📄 pagename.tsx