import {HttpTransportType, HubConnectionBuilder} from "@microsoft/signalr"

const signalRService = {
    connection: null,

    startConnection(url: string) {
        this.connection = new HubConnectionBuilder()
            .withUrl(url, {
                skipNegotiation: true, //had to disable because of the CORS issue
                transport: HttpTransportType.WebSockets, //necessary in case of skipping negotiation
            })
            .withAutomaticReconnect()
            .build()

        this.connection.start()
            .then(
                () => console.log("Connection started"),
                (err) => console.log("ERR(start-connection): ", err)
            )
    },

    onReceiveMessage(callback) {
        this.connection.on("ReceiveMessage", (user, message) => callback(user, message))
    },

    sendMessage(user, message) {
        this.connection.invoke("SendMessage", user, message)
            .then(() => console.log("Message send"))
            .catch(err => console.log("ERR(sendMessage): ", err))
    }
}

export default signalRService