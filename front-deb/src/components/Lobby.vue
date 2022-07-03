<template>
  <router-link to="/">Home</router-link>

  <div>
    <h2>Choose a team</h2>
    <button @click="selectTeam('A')">Team A</button>
    <button @click="selectTeam('B')">Team B</button>
    <h3 v-if="team">Your team is: {{ team }}</h3>
  </div>

  <div v-if="team" class="ready-deal">
    <button @click="readyToPlay">Ready</button>
    <button @click="dealCards">Deal</button>
  </div>
  <input type="text" v-model="text" @keydown.enter="sendText(text)" class="text-message" />

  <h3 v-if="chooser">{{ chooser }}</h3>
  <h1>{{ countDown }}</h1>
  <div v-if="otherCards">
    <h1 class="trump-title">Trump</h1>
    <Card :card="otherCards[0]" />
    <div v-if="name === chooser">
      <button>yes</button>
      <button @click="passTurn">pass</button>
    </div>
  </div>

  <div v-if="userPile" class="cards-wrap">
    <Card v-for="card in userPile" @dblclick="pickCard(card)" :card="card" class="card" />
  </div>
</template>

<script setup>
import Card from '@/components/Card.vue'
import { useRoute } from 'vue-router';
import { ref, onMounted } from 'vue'

const route = useRoute()

const socket = ref(null)
const id = route.params.id
const name = ref(null)

onMounted(() => {
  socket.value = new WebSocket('ws://localhost:4000/')
  name.value = (Math.random() * 100).toString()

  socket.value.onopen = () => {
    socket.value.send(JSON.stringify({
      method: 'connection',
      id,
      username: name.value.toString()
    }))
  }

  socket.value.onmessage = (event) => {
    let msg = JSON.parse(event.data)

      if (msg.method === "connection") {
        console.log(`user ${msg.username} connected`)
      }
      else if (msg.method === "text") {
        console.log(`user ${msg.name}: ${msg.message}`)
      }
      else if (msg[1].method === "countDown") {
        countDown.value = msg[0]
        console.log('count', msg[0])
      }
      else {
        console.log(msg)
        const piles = msg[0]
        chooser.value = msg[1]?.name
        userPile.value = piles[name.value.toString()]
        console.log(userPile.value)
        otherCards.value = piles['other']
        // countDownTimer()
      }
    }
})

const text = ref('')

const sendText = (msg) => {
  socket.value.send(JSON.stringify({
    id,
    name: name.value,
    message: msg,
    method: 'text'
  }))
}

const team = ref(null)
const selectTeam = (val) => {
  team.value = val
  console.log(team.value)
}

const userPile = ref(null)
const otherCards = ref(null)

const chooser = ref(null)

const dealCards = () => {
  socket.value.send(JSON.stringify({
    id,
    name: name.value,
    method: 'deal'
  }))
}

const readyToPlay = () => {
  socket.value.send(JSON.stringify({
    id,
    name: name.value,
    team: team.value,
    method: 'ready'
  }))
}

const countDown = ref(null)
const passTurn = () => {
  socket.value.send(JSON.stringify({
    id,
    method: 'pass',
    team: team.value
  }))
}

const pickCard = (card) => {
  console.log(card.suit)
}
</script>

<style scoped lang="scss">
a {
  color: #42b983;
}

.card {
  transition: all 0.2s ;
  &:hover {
    transform: scale(1.2);
  }
}

.trump-title {
  text-align: center;
}

.cards-wrap {
  margin-bottom: 30px;
}

.ready-deal {

}

.text-message {
  margin: 10px 0;
}
</style>
