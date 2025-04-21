<template>
    <div class="h-24"> </div>

    <div :class="[
        'w-5/6 h-20 fixed top-5 -translate-x-1/2 left-1/2 z-50 rounded-2xl backdrop-blur-sm bg-gray-500/10 border border-white/10 shadow-lg select-none',
        'transition-all duration-500 ease-in-out',
        isScrollingDown? '-translate-y-[150%]' : 'translate-y-0',
        'hover:scale-[101%] hover:border-white/20',
        'flex justify-between px-10'
        ]"
    >
        <strong class="my-auto text-3xl text-violet-400 cursor-pointer active:text-violet-500 font-bold font-quizano">
            <router-link :to="{ name: 'Home' }">DevGate</router-link>
        </strong>

        <div class="my-auto font-bold text-lg text-gray-100 flex justify-between items-center gap-9">
            <router-link :to="{ name: loggedIn? 'Explore': 'Signup' }" class="navBarLink">
                Explore
            </router-link>

            <router-link v-if="true" :to="{ name: 'Profile' }" class="navBarLink">
                Profile
            </router-link>

            <router-link v-if="loggedIn" :to="{ name: 'Home' }" class="navBarLink-orange" @click="handleLogout">
                Log out
            </router-link>

            <router-link v-else :to="{ name: 'Login' }" class="navBarLink-violet">
                Log in
            </router-link>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted, onUnmounted, computed } from 'vue';

    const isScrollingDown = ref(false);
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
        const currentScrollY = window.scrollY;
        isScrollingDown.value = currentScrollY > lastScrollY;
        lastScrollY = currentScrollY;
    }

    onMounted(() => {
        window.addEventListener('scroll', handleScroll);
    });

    onUnmounted(() => {
        window.removeEventListener('scroll', handleScroll);
    })

    import { logoutUser } from "../composables/useAuth"

    async function handleLogout(){
        logoutUser();
    }


    import { useUser } from '../composables/useUser'
    const { currentUser, isUserInitialized } = useUser();

    const loggedIn = computed(() => {return isUserInitialized && currentUser.value!=null});
</script>

