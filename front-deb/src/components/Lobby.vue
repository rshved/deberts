<template>
  Lobby
  <router-link to="/">Home</router-link>
  <input type="text" v-model="text" @keydown.enter="sendText(text)" />
  <button @click="dealCards">Deal</button>
  <button @click="readyToPlay">ready</button>
</template>

<script setup>
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
      else {
        console.log(name.value)
        console.log(msg[name.value.toString()])
        console.log(msg)
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
    method: 'ready'
  }))
}
</script>

<style scoped>
a {
  color: #42b983;
}
</style>
