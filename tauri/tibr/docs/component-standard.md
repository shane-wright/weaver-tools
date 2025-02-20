# TIBR Component Design Standard

## Overview

TIBR Components are designed in a standard way to create a html element with various configuration options.

It allows developers to customize a component's behavior, appearance, and functionality through a set of optional parameters.

## Mandatory Attributes

The `options` object is mandatory for creating any component. The following attributes are required:

- **id**: A string representing the unique identifier for the component.
- **classes**: An array of strings representing the CSS classes to be applied to the component.
- **style**: An object containing inline styles to be applied to the component.

## Optional Attributes

In addition to the mandatory attributes, the component can support optional attributes such as:

- **label**: A string representing the text label that will appear on the component.
- **onClick**: A function that handles the click event for the component. This allows developers to define custom behavior when the component is clicked.

## Component Structure

The component returns an `HTMLElement`. It is structured to encapsulate various properties and behaviors based on the options provided:

1. **Element Creation**: The element is created using document.createElement, for example: `document.createElement("button")`.

2. **Attributes Assignment**:
   - If `options.id` is provided, it is assigned to the component's `id` attribute.
   - If `options.classes` is an array, each class in the array is added to the component using `classList.add()`.
   - If `options.style` is an object, it is applied to the component using `Object.assign(button.style, options.style)`.

3. **Text Content**:
   - If `options.label` is provided, its text content is set on the component (textContent).

4. **Event Handling**:
   - If `options.onClick` is a function, an event listener is added to the component to handle click events.

## Usage Example

Here's an example of how you might use the TIBR component design standard:

### Example Component (Button)

```javascript
/**
* Button Component
* Creates a button element with the given options.
* @param {Object} options - Configuration options for the button.
* @param {string} options.id - The id of the button.
* @param {string[]} options.classes - The CSS classes for the button.
* @param {Object} options.style - Inline styles for the button.
* @param {string} options.label - The text label of the button.
* @param {Function} options.onClick - Click event handler for the button.
* @returns {HTMLElement} The created button element.
*/

// @func Button
export default function Button(options) {
    const button = document.createElement("button")

    // Assign the id if provided.
    if(options.id) {
        button.id = options.id
    }

    // Add the specified classes if provided.
    if(options.classes) {
        for(let className of options.classes) {
            button.classList.add(className)
        }
    }

    // Apply inline styles if provided.
    if(options.style) {
        Object.assign(button.style, options.style)
    }

    // Set the label text if provided.
    if(options.label) {
        button.textContent = options.label
    }

    // Attach a click event handler if provided.
    if(options.onClick) {
        button.addEventListener("click", options.onClick)
    }

    return button
}
```

## Example Usage

```javascript
    let selectFolderButton = Button({
        id: "selectFolderButton",
        label: "Get Files",
        style: {
            width: "200px",
        },
        onClick: async () => {
            let projectPath = tibr.getElement("selectFolderInput").value
            tibr.data.code.projectPath =  projectPath

            getSourceCode(tibr.data.code.projectPath, onMessage)
        },
    })
```
