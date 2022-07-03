<template>
    <img v-if="card" :src="card.image" alt="">
</template>

<script setup>
defineProps({
  card: Object
})

</script>

<style scoped lang="scss">

</style>