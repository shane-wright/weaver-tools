/**
* Toast Component
* @param {Object} options - Configuration options for the div element
* @param {string} [options.id] - ID for the div element
* @param {string[]} [options.classes] - CSS classes for the div element
* @param {Object} [options.style] - Inline styles for the div element
* @returns {HTMLHeadingElement} The configured div element
*/
// @func Toast
export default function Toast(options) {
    const toast = document.createElement("div")

    // Assign the id if provided.
    if(options.id) {
        toast.id = options.id
    }

    toast.classList.add("toast")

    // Add the specified classes if provided.
    if(options.classes) {
        for(let className of options.classes) {
            toast.classList.add(className)
        }
    }

    // set style
    Object.assign(toast.style, {
        position: "fixed",
        top: 0,
        left: 0,
        width: "400px",
        backgroundColor: "#0172AD",
        color: "var(--pico-color)",
        padding: "10px",
        borderTopRightRadius: "5px",
        borderBottomRightRadius: "5px",
        textAlign: "center",
        transition: "0.5s",
        transform: "translateX(-100%)",
        overflow: "hidden",
    })

    // Apply inline styles if provided.
    if(options.style) {
        Object.assign(toast.style, options.style)
    }

    let toastApp = {
        id: options.id,
        show: (message) => { show(message) },
        hide: () => { hide() },
    }

    toast.app = toastApp

    return toast
}

const show = (message) => {
    let toast = tibr.getElementByClass("toast")

    setTimeout(() => {
        toast.textContent = message
        toast.style.transform = "translateX(0)"
    }, 50)

    setTimeout(() => {
        toast.app.hide()
    }, 1500)

}

const hide = () => {
    let toast = tibr.getElementByClass("toast")

    if(toast) {
        toast.style.transform = "translateX(-100%)"
    }
}
