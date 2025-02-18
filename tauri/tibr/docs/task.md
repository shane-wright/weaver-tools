# Task

Add a save icon to the header


## Project/Purpose

This is a tauri application with a ES2024 Vanilla Javascript front end (direct DOM manipulation), and a rust backend.

## Specific Details

Update the `renderHeader` function in profile-view.js (code listing provided) to add a save icon.

Example:

```
    header.append(renderSaveIcon())
```

Implement the `renderSaveIcon` function. in profile-view.js.

Example:

```
// @func renderSaveIcon
const renderSaveIcon = () => {
    return Icon({
        id: "saveIcon",
        classes: ["ri-save-line"],
        style: { fontSize: "36px" },
        onClick: async (e) => {
            // TODO: add implementation once requirements are given
        }
    })
}
```

## Code Action

Inspect the `ai-chat-view.js` code listing and note the `renderSaveIcon` function's implementation.

Based on the renderSaveIcon function in `ai-chat-view.js`, create a similar function in `profile-view.js` called renderSaveIcon

## Output Type

Complete javascript code of `profile-view.js` with the added renderSaveIcon functin

## Format/Structure
  - ES2024 Javascript
  - Use the tibr javascript sdk
  - 4 spaces for indentation
  - Direct DOM manipulation
  - No semicolons for end of line
  - else, catch, etc. on its own line

## Assistant Notes

I can show you more examples or provide more info about the TIBR sdk, just ask.
