/**
* @function Nav - Nav Component
* @param {Object} options - Configuration options for the select element
* @param {string} [options.id] - ID for the select element
* @param {string[]} [options.classes] - CSS classes for the select element
* @param {Object} [options.style] - Inline styles for the select element
* @returns {HTMLHeadingElement} The configured select element
*/
export default function Nav(options) {
    const select = document.createElement('select')

    // Assign the id if provided.
    if(options.id) {
        select.id = options.id
    }
    else {
        select.id = "nav"
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

    refreshNav(select)

    if (options.onChange) {
        select.addEventListener('change', options.onChange)
    }
    else {
        select.addEventListener('change', (e) => {
            let viewName = e.target.value
            
            tibr.render(viewName)
        })
    }

    return select
}

function refreshNav(select) {
    if(select) {
        // Remove each option from the select element
        while (select.firstChild) {
            select.removeChild(select.firstChild)
        }

        if (tibr.nav.views) {
            Object.keys(tibr.nav.views).forEach(viewName => {
                let view = tibr.nav.views[viewName]

                if(view.showInHeader) {
                    const option = document.createElement('option')
                    option.value = viewName
                    option.textContent = view.label
                    if (viewName === tibr.view.name) {
                        option.selected = true
                    }
                    select.appendChild(option)
                }
            })
        }
    }
}
