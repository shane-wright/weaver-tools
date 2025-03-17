/**
* @function Audio - Audio Component
* @param {Object} options - Configuration options for the audio element
* @param {boolean} [options.controls=true] - Show controls for the audio
* @param {string} options.src - Source URL for the audio
* @param {string} [options.id] - ID for the audio element
* @param {string[]} [options.classes] - CSS classes for the audio element
* @param {Object} [options.style] - Inline styles for the audio element
* @returns {HTMLAudioElement} The configured audio element
*/
export default function Audio(options) {
    const audio = document.createElement("audio")

    // Set controls (default to true)
    if (options.controls === undefined) {
        audio.controls = true
    }
    else {
        audio.controls = options.controls
    }

    // Assign the source if provided.
    if (options.src) {
        const source = document.createElement("source")
        source.src = options.src
        source.type = "audio/mpeg"
        audio.appendChild(source)
    }
    else {
        throw new Error("Audio source (src) is required")
    }

    // Assign the id if provided.
    if (options.id) {
        audio.id = options.id
    }

    // Add the specified classes if provided.
    if (options.classes) {
        for (let className of options.classes) {
            audio.classList.add(className)
        }
    }

    // Apply inline styles if provided.
    if (options.style) {
        Object.assign(audio.style, options.style)
    }

    audio.play = () => {
        if (!audio.paused) return
        audio.play()
    }

    audio.pause = () => {
        if (audio.paused) return
        audio.pause()
    }

    return audio
}

