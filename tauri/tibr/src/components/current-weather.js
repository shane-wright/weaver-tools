import Container from "./container.js"
import H1 from "./h1.js"
import HR from "./hr.js"

const DateTime = luxon.DateTime

/**
* CurrentWeather Component
* @param {Object} options - Configuration options for the current weather display
* @param {Object} options.data - Weather data to display
* @returns {HTMLDivElement} The configured current weather element
*/
// @func CurrentWeather
export default function CurrentWeather(options) {
    const container = Container(options)

    container.style.backgroundColor = tibr.theme.colors.slate["800"]
    container.style.borderRadius = "10px"
    container.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)"
    container.style.padding = "20px"
    container.style.width = "100%"
    container.style.textAlign = "center"
    container.style.margin = "0"

    container.append(renderTitle())
    container.append(renderTime(options.data))
    container.append(HR({}))
    container.append(renderWeather(options.data))

    return container
}

const renderTitle = () => {
    let weatherTitleContainer = Container({
        id: "weatherTitleContainer",
    })

    let weatherTitle = H1({
        id: "weatherTitle",
        label: "CURRENT WEATHER",
    })

    weatherTitle.style.marginBottom = "0"

    weatherTitleContainer.append(weatherTitle)

    return weatherTitleContainer
}

// @func renderWeather
const renderWeather = (weatherData) => {
    let weatherContainer = Container({
        id: "weatherContainer",
    })

    weatherContainer.append(renderDayNight(weatherData))
    weatherContainer.append(renderTemperature(weatherData))
    weatherContainer.append(renderFeelsLike(weatherData))
    weatherContainer.append(renderWind(weatherData))
    weatherContainer.append(renderHumidity(weatherData))
    weatherContainer.append(renderPrecipitation(weatherData))

    return weatherContainer
}

// @func renderDayNight
const renderDayNight = (weatherData) => {
    let weatherDayNightContainer = Container({
        id: "weatherDayNightContainer",
        style: {
            width: "100%",
        }
    })

    let currentWeather = weatherData.current
    let isDay = currentWeather.isDay == "1" ? true : false

    let dayNightIcon = document.createElement("i")
    dayNightIcon.id = "dayNightIcon"
    dayNightIcon.classList.add("icon")

    if(isDay) {
        dayNightIcon.classList.add("ri-sun-fill")
    }
    else {
        dayNightIcon.classList.add("ri-moon-fill")
    }

    weatherDayNightContainer.append(dayNightIcon)


    return weatherDayNightContainer
}

// @func renderTime
const renderTime = (weatherData) => {
    let weatherTime = Container({
        id: "weatherTime",
        style: {
            fontStyle: "italic",
            fontSize: "smaller",
        }
    })

    let currentWeather = weatherData.current

    let time = DateTime.fromISO(chop(currentWeather.time)) // time is already in correct time zone, chop the "Z" from "2024-09-08T11:00:00.000Z"

    weatherTime.append(time.toLocaleString(DateTime.DATETIME_MED))

    return weatherTime
}

// @func renderTemperature
const renderTemperature = (weatherData) => {
    let weatherTemperatureContainer = Container({
        id: "weatherTemperatureContainer",
        style: {
            display: "flex",
            width: "100%",
        }
    })

    let currentWeather = weatherData.current

    let temperature = currentWeather.temperature

    // Round the temperature to one decimal place for readability
    const roundedTemp = Math.round(temperature * 10) / 10

    let weatherTemperatureLabel = Container({
        id: "weatherTemperatureLabel",
        style: {
            flex: 1,
        }
    })

    weatherTemperatureLabel.append("Temperature")
    weatherTemperatureContainer.append(weatherTemperatureLabel)

    let weatherTemperature = Container({
        id: "weatherTemperature",
        style: {
            flex: 1,
        }
    })

    weatherTemperature.innerHTML = `${roundedTemp}°<span style="font-size: small">F</span>`
    weatherTemperatureContainer.append(weatherTemperature)


    return weatherTemperatureContainer
}

// @func renderFeelsLike
const renderFeelsLike = (weatherData) => {
    let weatherFeelsLikeContainer = Container({
        id: "weatherFeelsLikeContainer",
        style: {
            display: "flex",
            width: "100%",
        }
    })

    let currentWeather = weatherData.current

    let temperature = currentWeather.feelsLike

    // Round the temperature to one decimal place for readability
    const roundedTemp = Math.round(temperature * 10) / 10

    let weatherFeelsLikeLabel = Container({
        id: "weatherFeelsLikeLabel",
        style: {
            flex: 1,
        }
    })

    weatherFeelsLikeLabel.append("Feels Like")
    weatherFeelsLikeContainer.append(weatherFeelsLikeLabel)

    let weatherFeelsLike = Container({
        id: "weatherFeelsLike",
        style: {
            flex: 1,
        }
    })

    weatherFeelsLike.innerHTML = `${roundedTemp}°<span style="font-size: small">F</span>`
    weatherFeelsLikeContainer.append(weatherFeelsLike)


    return weatherFeelsLikeContainer
}

// @func renderWind
const renderWind = (weatherData) => {
    let weatherWindContainer = Container({
        id: "weatherWindContainer",
        style: {
            display: "flex",
            width: "100%",
        }
    })

    let currentWeather = weatherData.current

    let windDirection = getWindDirection(parseFloat(currentWeather.wind.direction))
    let windSpeed = parseInt(currentWeather.wind.speed)
    // let windGusts = parseInt(currentWeather.wind.gusts)

    let weatherWindLabel = Container({
        id: "weatherWindLabel",
        style: {
            flex: 1,
        }
    })

    weatherWindLabel.append("Wind")
    weatherWindContainer.append(weatherWindLabel)

    let weatherWind = Container({
        id: "weatherWind",
        style: {
            flex: 1,
        }
    })

    weatherWind.innerHTML = `${windDirection} - ${windSpeed}<span style="font-size: small;">mph</span>`
    weatherWindContainer.append(weatherWind)


    return weatherWindContainer
}

// @func renderHumidity
const renderHumidity = (weatherData) => {
    let weatherHumidityContainer = Container({
        id: "weatherHumidityContainer",
        style: {
            display: "flex",
            width: "100%",
        }
    })

    let currentWeather = weatherData.current

    let humidity = currentWeather.humidity

    let weatherHumidityLabel = Container({
        id: "weatherHumidityLabel",
        style: {
            flex: 1,
        }
    })

    weatherHumidityLabel.append("Humidity")
    weatherHumidityContainer.append(weatherHumidityLabel)

    let weatherHumidity = Container({
        id: "weatherHumidity",
        style: {
            flex: 1,
        }
    })

    weatherHumidity.innerHTML = `${humidity}<span style="font-size: small;">%</span>`
    weatherHumidityContainer.append(weatherHumidity)


    return weatherHumidityContainer
}

// @func renderPrecipitation
const renderPrecipitation = (weatherData) => {
    let weatherPrecipitationContainer = Container({
        id: "weatherPrecipitationContainer",
        style: {
            display: "flex",
            width: "100%",
        }
    })

    let currentWeather = weatherData.current

    let precipitation = currentWeather.precipitation

    let weatherPrecipitationLabel = Container({
        id: "weatherPrecipitationLabel",
        style: {
            flex: 1,
        }
    })

    weatherPrecipitationLabel.append("Precipitation")
    weatherPrecipitationContainer.append(weatherPrecipitationLabel)

    let weatherPrecipitation = Container({
        id: "weatherPrecipitation",
        style: {
            flex: 1,
        }
    })

    weatherPrecipitation.innerHTML = `<div>${precipitation}</div>`
    weatherPrecipitationContainer.append(weatherPrecipitation)


    return weatherPrecipitationContainer
}

// @func chop
const chop = (str) => {
    if (str && str.length > 0) {
        return str.slice(0, -1)
    } else {
        return str // Return as is if it's empty or undefined
    }
}

const getWindDirection = (degrees) => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
    return directions[Math.round(((degrees % 360) / 45)) % 8]
}
