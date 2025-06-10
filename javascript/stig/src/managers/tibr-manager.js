import { clearView, renderView } from "./view-manager.js"
import { readFile } from "../managers/data-manager.js"
import viewModules from "./view-modules.js"

// @function initialize
const initialize = async () => {
    tibr.nav.views = viewModules.views

    let tibrFunctions = {
        getElement: getElement,
        getElementByClass: getElementByClass,
        getFileExtension: getFileExtension,
        padZero: padZero,
        render: render,
        scrollTop: scrollTop,
        clearView: () => { clearView() },
        renderView: (viewName) => { renderView(viewName) },
    }

    window.tibr = {
        ...window.tibr,
        ...tibrFunctions,
    }

    tibr.render()

    // Detect hash change
    window.onhashchange = () => {
        let locationName = location.hash.replace("#", "")

        if(tibr.view.name != locationName) {
            tibr.render(locationName)
        }
    }
}

// @function render
const render = async (viewName) => {
    tibr.clearView()

    tibr.renderView(viewName)
}

// @function getElement
const getElement = (elementId) => {
    let element = document.getElementById(elementId)
    return element
}

// @function getElementByClass
const getElementByClass = (className) => {
    let elements = document.getElementsByClassName(className)
    if(elements && elements.length > 0) {
        return elements[0]
    }
    else {
        return null
    }
}

// @function padZero
const padZero = (num) => {
    return num.toString().padStart(2, "0")
}

// @function scrollTop
const scrollTop = () => {
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
}

const getFileExtension = (filename) => {
    const parts = filename.split('.');
    return parts.length > 1 ? parts.pop() : '';
}

export { initialize }
