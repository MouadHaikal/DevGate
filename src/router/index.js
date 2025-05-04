import { createWebHistory, createRouter } from 'vue-router'
import { getCurrentUser } from "../composables/useAuth"

// Public routes
import Home from '../views/Home.vue'
import Explore from '../views/Explore.vue'
import Signup from "../views/Signup.vue"
import Login from "../views/Login.vue"

// Protected routes
import Profile from '../views/Profile.vue'
import Stats from "../views/Stats.vue"

const routes = [
    // Public routes
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: { requiresAuth: false }
    },
    {
        path: '/explore',
        name: 'Explore',
        component: Explore,
        meta: { requiresAuth: false }
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: { requiresAuth: false }
    },
    {
        path: '/signup',
        name: 'Signup',
        component: Signup,
        meta: { requiresAuth: false }
    },

    // Protected routes
    {
        path: '/profile',
        name: 'Profile',
        component: Profile,
        meta: { requiresAuth: true }
    },
    {
        path: '/stats/:username',
        name: 'Stats',
        component: Stats,
        meta: { requiresAuth: true }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    const user = await getCurrentUser()

    if (requiresAuth && !user) {
        // Redirect to login if trying to access protected route while not authenticated
        next({ name: 'Login' })
    } else if ((to.name === 'Login' || to.name === 'Signup') && user) {
        // Redirect to home if trying to access auth pages while already authenticated
        next({ name: 'Home' })
    } else {
        next()
    }
})

export default router

