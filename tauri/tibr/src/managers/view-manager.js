import viewModules from "./view-modules.js"

// @func renderView
const renderView = async (viewName) => {
    if(!viewName) {
        if(tibr.data.profile.preferences) {
            viewName = tibr.data.profile.preferences.view.default
        }
        else {
            viewName = viewModules.default
        }
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
        console.error(viewName)
        viewName = viewModules.default

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

// @func clearView
const clearView = () => {
    if(tibr.view.app && tibr.view.app.onDestroy) {
        tibr.view.app.onDestroy()
    }

    tibr.getElement("mainContent").innerHTML = ""
    tibr.view = {}
}

export { renderView, clearView }
