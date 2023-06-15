import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './components/HomePage.vue'
import AboutPage from './components/AboutPage.vue'


const routes = [
    { path: '/', component: HomePage },
    { path: '/about', component: AboutPage }
]

const router = createRouter({
    routes,
    history: createWebHistory(process.env.BASE_URL),
})

export default router