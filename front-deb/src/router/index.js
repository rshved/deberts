import { createRouter, createWebHistory } from "vue-router";

import Lobby from '@/components/Lobby.vue'
import HelloWorld from '@/components/HelloWorld.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HelloWorld
  },
  {
    path: '/lobby/:id',
    name: 'Lobby',
    component: Lobby
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router