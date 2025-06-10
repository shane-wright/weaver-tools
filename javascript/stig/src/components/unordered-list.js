/**
 * @function UnorderedList - Creates an unordered list element with the given options.
 * @param {Object} options - Configuration options for the unordered list.
 * @param {string} options.id - The id of the unordered list.
 * @param {string[]} options.classes - The CSS classes for the unordered list.
 * @param {Object} options.style - Inline styles for the unordered list.
 * @param {Function} options.onClick - Click event handler for the unordered list.
 * @returns {HTMLElement} The created unordered list element.
 */
export default function UnorderedList(options) {
    const unorderedList = document.createElement("ul")

    if (options.id) {
        unorderedList.id = options.id
    }

    if (options.classes) {
        for (let className of options.classes) {
            unorderedList.classList.add(className)
        }
    }

    if (options.style) {
        Object.assign(unorderedList.style, options.style)
    }

    if (options.onClick) {
        unorderedList.addEventListener("click", options.onClick)
    }

    return unorderedList
}
