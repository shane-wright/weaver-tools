// @func ListItem
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
