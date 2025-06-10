import viewModules from "./view-modules.js"

// @function renderView
const renderView = async (viewName) => {
    if(!viewName) {
        viewName = tibr.data.views.default
    }

    tibr.view.name = viewName
    window.location.hash = `#${viewName}`

    if(viewModules.views[viewName]) {
        const modulePath = viewModules.views[viewName].modulePath

        try {
            const viewModule = await import(`${modulePath}.js`)
            await viewModule.render()
            tibr.view.app = viewModule
        } catch (error) {
            console.error("Error loading or rendering view module:", error)
        }
    }
    else {
        viewName = tibr.data.views.default

        tibr.view.name = viewName
        window.location.hash = `#${viewName}`

        const modulePath = viewModules.views[viewName].modulePath
        try {
            const viewModule = await import(modulePath)
            await viewModule.render()
            tibr.view.app = viewModule
        } catch (error) {
            console.error("Error loading or rendering view module:", error)
        }
    }
}

// @function clearView
const clearView = () => {
    if(tibr.view.app && tibr.view.app.onDestroy) {
        tibr.view.app.onDestroy()
    }

    tibr.getElement("mainContent").innerHTML = ""
    tibr.view = {}
}

export { renderView, clearView }
