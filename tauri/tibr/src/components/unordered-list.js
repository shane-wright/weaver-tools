// @func UnorderedList
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
