<template>
  <h1>{{ msg }}</h1>

  <p>
    Recommended IDE setup:
    <a href="https://code.visualstudio.com/" target="_blank">VS Code</a>
    +
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
  </p>

  <p>
    <a href="https://vitejs.dev/guide/features.html" target="_blank">
      Vite Documentation
    </a>
    |
    <a href="https://v3.vuejs.org/" target="_blank">Vue 3 Documentation</a>
  </p>

  <button type="button" @click="count++">count is: {{ count }}</button>
  <p>
    Edit
    <code>components/HelloWorld.vue</code> to test hot module replacement.
  </p>
  <button @click="$router.push(`/lobby/${id}`)">lobby</button>
<!--  <router-link :to=`/lobby/${id.value}`>Home</router-link>-->

</template>
<script setup>
import { ref, onMounted } from 'vue'

const id = ref(null)

onMounted(() => {
  id.value = Date.now().toString()
})

defineProps({
  msg: String
})

const count = ref(0)
</script>


<style scoped>
a {
  color: #42b983;
}
</style>
