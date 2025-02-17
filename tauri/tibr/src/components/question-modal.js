/**
* QuestionModal Component
* @param {Object} options - Configuration options for the modal
* @param {string} [options.id] - ID for the modal
* @param {string[]} [options.classes] - CSS classes for the modal
* @param {Object} [options.style] - Inline styles for the modal
* @param {Function} options.onSave - Click event handler for the save button
* @returns {HTMLDialogElement} The configured modal element
*/
// @func QuestionModal
export default function QuestionModal(options) {
    const modal = document.createElement("dialog")

    // Assign the id if provided.
    if(options.id) {
        modal.id = options.id
    }

    // Add the specified classes if provided.
    modal.classList.add("question-modal")

    if(options.classes) {
        for(let className of options.classes) {
            modal.classList.add(className)
        }
    }

    // Apply inline styles if provided.
    if(options.style) {
        Object.assign(modal.style, options.style)
    }

    const article = document.createElement("article")
    article.style.display = "flex"
    article.style.flexDirection = "column"

    modal.append(article)

    const header = document.createElement("header")
    article.append(header)

    let title = document.createElement("h4")

    if(options.title) {
        title.append(options.title)
    }

    header.append(title)

    let content = document.createElement("div")
    content.style.flex = 1

    article.append(content)

    let description = document.createElement("input")
    description.id = `${options.id}Description`
    description.type = "text"
    description.placeholder = "Enter description"

    content.append(description)

    description.addEventListener("input", () => {
        saveButton.disabled = !description.value.trim();
    });

    const footer = document.createElement("footer")
    footer.style.alignSelf = "flex-end"

    article.append(footer)

    // Disable saveButton until the user enters a value in the description input
    const saveButton = document.createElement("button")
    saveButton.disabled = true;
    saveButton.classList.add("outline")
    saveButton.append("Save")

    saveButton.addEventListener("click", options.onSave)

    footer.append(saveButton)

    const cancelButton = document.createElement("button")
    cancelButton.classList.add("outline")
    cancelButton.append("Cancel")

    cancelButton.addEventListener("click", () => {
        closeModal()
    })

    footer.append(cancelButton)

    let modalApp = {
        id: options.id,
        isOpenClass: "modal-is-open",
        openingClass: "modal-is-opening",
        closingClass: "modal-is-closing",
        scrollbarWidthCssVar: "--pico-scrollbar-width",
        animationDuration: 400,
        visible: false,
        openModal: () => { openModal() },
        closeModal: () => { closeModal() },
        getScrollbarWidth: () => { getScrollbarWidth() },
        isScrollbarVisible: () => { isScrollbarVisible() },
        getDescription: () => {
            return tibr.getElement(`${options.id}Description`).value
        },
    }

    modal.app = modalApp
    return modal
}

// @func openModal
const openModal = () => {
    let modal = tibr.getElementByClass("question-modal")

    const { documentElement: html } = document

    const scrollbarWidth = modal.app.getScrollbarWidth()

    if(scrollbarWidth) {
        html.style.setProperty(modal.app.scrollbarWidthCssVar, `${scrollbarWidth}px`)
    }

    html.classList.add(modal.app.isOpenClass, modal.app.openingClass)

    setTimeout(() => {
        modal.app.visible = true
        html.classList.remove(modal.app.openingClass)
    }, modal.app.animationDuration)

    modal.showModal()
}

// @func closeModal
const closeModal = () => {
    let modal = tibr.getElementByClass("question-modal")

    modal.app.visible = false

    const { documentElement: html } = document

    html.classList.add(modal.app.closingClass)

    setTimeout(() => {
        html.classList.remove(modal.app.closingClass, modal.app.isOpenClass)
        html.style.removeProperty(modal.app.scrollbarWidthCssVar)
        modal.close()
    }, modal.app.animationDuration)
}

// Close with Esc key
document.addEventListener("keydown", (event) => {
    let modal = tibr.getElementByClass("question-modal")

    if (event.key === "Escape" && modal && modal.app.visible) {
        modal.app.closeModal()
    }
})

// Get scrollbar width
const getScrollbarWidth = () => {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    return scrollbarWidth
}

// Is scrollbar visible
const isScrollbarVisible = () => {
    return document.body.scrollHeight > screen.height
}
