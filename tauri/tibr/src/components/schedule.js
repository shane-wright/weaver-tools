/**
* Schedule Component
* @param {Object} options - Configuration options for the table element
* @param {string} [options.id] - ID for the table element
* @param {string[]} [options.classes] - CSS classes for the table element
* @param {Object} [options.style] - Inline styles for the table element
* @param {string[]} [options.headers] - Headers for the table element
* @param {Object[]} [options.items] - Items for the table element
* @returns {HTMLHeadingElement} The configured table element
*/
// @func Schedule
export default function Schedule(options) {
    const schedule = document.createElement("table")
    schedule.id = "momentSchedule"

    // Add the specified classes if provided.
    if(options.classes) {
        for(let className of options.classes) {
            schedule.classList.add(className)
        }
    }

    // Apply inline styles if provided.
    if(options.style) {
        Object.assign(schedule.style, options.style)
    }

    // create header
    const scheduleHeader = document.createElement("thead")
    schedule.append(scheduleHeader)

    const headerRow = document.createElement("tr")
    scheduleHeader.append(headerRow)

    for(const headerItem of options.headers) {
        const headerElement = document.createElement("th")
        headerRow.append(headerElement)

        headerElement.innerHTML = headerItem
    }

    // create body
    const scheduleBody = document.createElement("tbody")
    schedule.append(scheduleBody)

    for(const item of options.items) {
        const row = document.createElement("tr")
        row.id = item.hour
        row.style.background = tibr.theme.colors[item.color.base][item.color.variant]
        row.style.height = "100px"

        scheduleBody.append(row)

        for(const headerItem of options.headers) {
            const element = document.createElement("td")
            element.style.background = "transparent"
            element.style.padding = "2px"

            row.append(element)

            element.innerHTML = item[headerItem.toLowerCase()]
        }
    }

    setTimeout(renderRowBorder, 1000)

    let scheduleApp = {
        intervalId: null,
        clearScheduleInterval: clearScheduleInterval,
    }

    schedule.app = scheduleApp
    return schedule
}

// @func renderRowBorder
const renderRowBorder = () => {
    let scheduleApp = tibr.getElement("momentSchedule").app

    scheduleApp.intervalId = setInterval(updateTimeLine, 10000)
    updateTimeLine()
}

// @func updateTimeLine
const updateTimeLine = () => {
    let now = new Date()
    let hour = `${tibr.padZero(now.getHours())}00`

    let table = tibr.getElement("momentSchedule")

    const rows = table.getElementsByTagName("tr")

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i]

        if(row.id == hour) {
            row.style.border = "4px"
            row.style.borderStyle = "solid"
            row.style.borderColor = tibr.theme.colors.lime["150"]
        }
        else {
            row.style.border = "none"
        }
    }
}

// @func clearScheduleInterval
const clearScheduleInterval = () => {
    let scheduleApp = tibr.getElement("momentSchedule").app

    if(scheduleApp.intervalId) {
        clearInterval(scheduleApp.intervalId)
        scheduleApp.intervalId = null
    }
}
