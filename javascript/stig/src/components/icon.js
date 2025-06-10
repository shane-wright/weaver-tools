/**
* @function Icon - Icon Component
* Creates an icon element with the given options.
* @param {Object} options - Configuration options for the icon.
* @param {string} options.id - The id of the icon.
* @param {string[]} options.classes - The CSS classes for the icon.
* @param {Object} options.style - Inline styles for the icon.
* @param {string} options.icon - The remix icon name.
* @returns {HTMLElement} The created icon element.
*/

export default function Icon(options) {
    const icon = document.createElement("i");

    // Assign the id if provided.
    if(options.id) {
        icon.id = options.id;
    }

    // Add the initial 'icon' class.
    icon.classList.add("icon");

    // Add the specified classes if provided.
    if(options.classes) {
        for(let className of options.classes) {
            icon.classList.add(className);
        }
    }

    // Apply inline styles if provided.
    if(options.style) {
        Object.assign(icon.style, options.style);
    }

    // Attach a click event handler if provided.
    if(options.onClick) {
        icon.addEventListener("click", options.onClick);
    }

    return icon;
}
