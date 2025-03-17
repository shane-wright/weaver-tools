/**
* @function ViewSelector - ViewSelector Component
* @param {Object} options - Configuration options for the select element
* @param {string} [options.id] - ID for the select element
* @param {string[]} [options.classes] - CSS classes for the select element
* @param {Object} [options.style] - Inline styles for the select element
* @returns {HTMLHeadingElement} The configured select element
*/

import viewModules from "../managers/view-modules.js"

export default function ViewSelector(options) {
    const select = document.createElement('select')

    // Assign the id if provided.
    if(options.id) {
        select.id = options.id
    }

    // Add the specified classes if provided.
    if(options.classes) {
        for(let className of options.classes) {
            select.classList.add(className)
        }
    }

    // Apply inline styles if provided.
    if(options.style) {
        Object.assign(select.style, options.style)
    }

    refreshViewSelector(select)

    if (options.onChange) {
        select.addEventListener('change', options.onChange)
    }

    return select
}

function refreshViewSelector(select) {
    if(select) {
        // Remove each option from the select element
        while (select.firstChild) {
            select.removeChild(select.firstChild)
        }

        if(viewModules.views) {
            Object.keys(viewModules.views).forEach((viewName) => {
                let view = viewModules.views[viewName]

                if(view.showInHeader) {
                    const option = document.createElement('option')
                    option.value = viewName
                    option.textContent = view.label
                    if(viewName === tibr.data.views.default) {
                        option.selected = true
                    }
                    select.appendChild(option)
                }
            })
        }
    }
}
