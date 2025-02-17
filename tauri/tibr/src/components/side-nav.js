/**
-* Side Nav Component
-* Creates a side navigation element with the given options.
-* @param {Object} options - Configuration options for the side navigation.
-* @param {string} [options.id] - The id of the side navigation.
-* @param {string[]} [options.classes] - The CSS classes for the side navigation.
-* @param {Object} [options.style] - Inline styles for the side navigation.
-* @param {Array<Object>} [options.items] - An array of items to be displayed in the side navigation.
-* @returns {HTMLElement} The created side navigation element.
-*/

import UnorderedList from "./unordered-list.js"
import ListItem from "./list-item.js"

// @func SideNav
export default function SideNav(options) {
    const nav = document.createElement("nav")

    // Assign the id if provided.
    if (options.id) {
        nav.id = options.id
    }

    // Add the specified classes if provided.
    if (options.classes) {
        for (let className of options.classes) {
            nav.classList.add(className)
        }
    }

    // Apply inline styles if provided.
    if (options.style) {
        Object.assign(nav.style, options.style)
    }

    // Create and add items to the side navigation
    if (options.items && Array.isArray(options.items)) {
        const ul = UnorderedList({
            id: uuid(),
        })

        for (let item of options.items) {
            const listItem = ListItem({
                id: uuid(),
            })

            const link = document.createElement("a")

            // Assign the id if provided.
            if (item.id) {
                link.id = item.id
            }

            // Add the specified classes if provided.
            if (item.classes) {
                for (let className of item.classes) {
                    link.classList.add(className)
                }
            }

            // Apply inline styles if provided.
            if (item.style) {
                Object.assign(link.style, item.style)
            }

            // Set the label text if provided.
            if (item.label) {
                link.textContent = item.label
            }

            // Attach a click event handler if provided.
            if (item.onClick) {
                link.addEventListener("click", item.onClick)
            }

            listItem.appendChild(link)
            ul.appendChild(listItem)
        }

        nav.appendChild(ul)
    }

    return nav
}
