const express = require('express')
const app = express()
const axios = require('axios')

const WSServer = require('express-ws')(app)
const aWss = WSServer.getWss()

const PORT = process.env.PORT || 4000

//get cards
let cards = null;
let piles = null;
(async function getCards () {
  try {
    const { data: deck } = await axios('https://deckofcardsapi.com/api/deck/new/shuffle/?cards=AS,7S,8S,9S,10S,JS,QS,KS,AD,7D,8D,9D,' +
      '10D,JD,QD,KD,AC,7C,8C,9C,10C,JC,QC,KC,AH,7H,8H,9H,10H,JH,QH,KH')

    if (deck.deck_id) {
      try {
        const { data } = await axios (`https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=28`)
        cards = data.cards
      } catch (e) {
        console.error(e)
      }
    }

    piles = cards?.reduce((accum, item) => {
      const lastPile = accum[accum.length - 1]
      if (lastPile && lastPile.length < 6) {
        lastPile.push(item)
      } else accum.push([item])
      return accum
    }, [])
  } catch (error) {
    console.error(error)
  }
})()
//

app.ws('/', (ws, res) => {
  console.log('Connection established')
  ws.send('You have successfully connected')
  ws.on('message', (msg) => {
    msg = JSON.parse(msg)
    switch (msg.method) {
      case 'connection':
        connectionHandler(ws, msg)
        break
      case 'text':
        broadcastConnection(ws, msg)
        break
      case 'deal':
        sendCards(ws, msg, piles)
        break
      case 'ready':
        setReadyUsers(ws, msg)
        break
    }
  })
})

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))

//декомпозировать
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

const sendCards = (ws, msg, piles) => {
    const map = {}
    piles?.reduce((accum, item, index) => {
      if (readyUsers.length !== index) {
        map[readyUsers[index]] = item
      } else if (index === readyUsers.length) {
        map['other'] = item
      }
      return map
    }, {})
  broadcastConnection(ws, msg, map)
}

const readyUsers = []
const setReadyUsers = (ws, msg) => {
  readyUsers.push(msg.name)
}