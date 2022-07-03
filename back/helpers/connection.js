const WSServer = require('express-ws')(app)
const aWss = WSServer.getWss()

const connectionHandler = (ws, msg) => {
  ws.id = msg.id
  broadcastConnection(ws, msg)
}

const broadcastConnection = (ws, msg, other) => {
  aWss.clients.forEach(client => {
    if (client.id === msg.id) {
      if (!other) {
        client.send(JSON.stringify(msg))
      }
      else {
        client.send(JSON.stringify(other))
      }
    }
  })
}