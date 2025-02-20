import { clearView, renderView } from "./view-manager.js"
import { initializeDatabase, getProfile } from "./data-manager.js"
import viewModules from "./view-modules.js"
import { colors } from "./theme-manager.js"
// LATER: [integrate websockets] import { wsConnect } from "./ws-manager.js"

// @func initialize
const initialize = async () => {
    // LATER: [integrate websockets] wsConnect()

    tibr.nav.views = viewModules.views

    let tibrFunctions = {
        getElement: getElement,
        getElementByClass: getElementByClass,
        padZero: padZero,
        render: render,
        scrollTop: scrollTop,
        clearView: () => { clearView() },
        renderView: (viewName) => { renderView(viewName) },
    }

    let theme = { theme: { colors: colors } }

    window.tibr = {
        ...window.tibr,
        ...tibrFunctions,
        ...theme,
    }

    await initializeDatabase()

    tibr.data.profile = await getProfile()
    /*
     * TODO: insert/create/save a new profile if none exists
    if(Object.keys(profile).length === 0) {
        await insertProfile()
    }
    */

    tibr.render()

    // Detect hash change
    window.onhashchange = () => {
        let locationName = location.hash.replace("#", "")

        if(tibr.view.name != locationName) {
            tibr.render(locationName)
        }
    }
}

// @func render
const render = async (viewName) => {
    tibr.clearView()

    tibr.renderView(viewName)
}

// @func getElement
const getElement = (elementId) => {
    let element = document.getElementById(elementId)
    return element
}

// @func getElementByClass
const getElementByClass = (className) => {
    let elements = document.getElementsByClassName(className)
    if(elements && elements.length > 0) {
        return elements[0]
    }
    else {
        return null
    }
}

// Helper function to pad single digit hours with a zero
// @func padZero
const padZero = (num) => {
    return num.toString().padStart(2, "0")
}

// @func scrollTop
const scrollTop = () => {
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
}

export { initialize }
