/**
* @function RecentSelector - RecentSelector Component
* @param {Object} options - Configuration options for the select element
* @param {string} [options.id] - ID for the select element
* @param {string[]} [options.classes] - CSS classes for the select element
* @param {Object} [options.style] - Inline styles for the select element
* @returns {HTMLHeadingElement} The configured select element
*/
export default function RecentSelector(options) {
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

    if (options.onChange) {
        select.addEventListener('change', options.onChange)
    }

    let selectApp = {
        id: options.id,
        refreshRecents: () => { refreshRecents(select) },
        selectRecent: (projectPath) => { selectRecent(select, projectPath) },
    }

    select.app = selectApp

    return select
}

// @function refreshRecents
function refreshRecents(select) {
    if(select) {
        // Remove each option from the select element
        while (select.firstChild) {
            select.removeChild(select.firstChild)
        }

        let recents = tibr.data.projects.recents

        if (recents) {
            recents.forEach(recent => {
                const option = document.createElement('option')
                option.value = recent
                option.textContent = recent
                // if(model.value === tibr.data.ai.model) {
                //     option.selected = true
                // }
                select.appendChild(option)
            })
        }
    }
}

// @function selectRecent
function selectRecent(select, projectPath) {
    const options = select.options
    for (let i = 0; i < options.length; i++) {
        if (options[i].value === projectPath) {
            select.selectedIndex = i
            break
        }
    }
}
