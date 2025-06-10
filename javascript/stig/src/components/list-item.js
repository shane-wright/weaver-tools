/**
* @function ListItem - Creates a list item element with the given options.
* @param {Object} options - Configuration options for the list item.
* @param {string} options.id - The id of the list item.
* @param {string[]} options.classes - The CSS classes for the list item.
* @param {Object} options.style - Inline styles for the list item.
* @param {string} options.label - The text label of the list item.
* @param {Function} options.onClick - Click event handler for the list item.
* @returns {HTMLElement} The created list item element.
*/
export default function ListItem(options) {
    const listItem = document.createElement("li")

    if (options.id) {
        listItem.id = options.id
    }

    if (options.classes) {
        for (let className of options.classes) {
            listItem.classList.add(className)
        }
    }

    if (options.style) {
        Object.assign(listItem.style, options.style)
    }

    if (options.label) {
        listItem.textContent = options.label
    }

    if (options.onClick) {
        listItem.addEventListener("click", options.onClick)
    }

    return listItem
}
