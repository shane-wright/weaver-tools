// @func wsConnect
const wsConnect = async () => {
    tibr.socket = new WebSocket('ws://localhost:4010')

    tibr.socket.onopen = () => {
        
    }

    tibr.socket.onmessage = (event) => {
        const message = JSON.parse(event.data)

        

        if(tibr.view.app.onMessage) {
            tibr.view.app.onMessage(message)
        }
    }

    tibr.socket.onclose = () => {
        
        setTimeout(wsConnect, 5000); // Try to reconnect after 5 seconds
    }

    tibr.socket.onerror = (error) => {
        console.error('WebSocket Error:', error)
        setTimeout(wsConnect, 5000); // Try to reconnect after 5 seconds
    }
}

export { wsConnect }
