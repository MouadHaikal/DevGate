import { createWebHistory, createRouter } from 'vue-router'

import Home from '../views/Home.vue'
import Explore from '../views/Explore.vue'
import Profile from '../views/Profile.vue'

import Signup from "../views/Signup.vue"
import Login from "../views/Login.vue"


const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/explore',
        name: 'Explore',
        component: Explore
    },
    {
        path: '/profile',
        name: 'Profile',
        component: Profile
    },
    {
        path: '/signup',
        name: 'Signup',
        component: Signup
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;

