import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import FactoryView from '@/views/FactoryView.vue'
import SettingsView from '@/views/SettingsView.vue'
import StatsView from '@/views/StatsView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/factory', name: 'factory', component: FactoryView },
  { path: '/stats', name: 'stats', component: StatsView },
  { path: '/settings', name: 'settings', component: SettingsView }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
