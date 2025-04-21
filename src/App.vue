<template>
    <nav-bar/>

    <notification/>

    <router-view/>
</template>

<script setup>
    import NavBar from './components/NavBar.vue'
    import Notification from './components/Notification.vue';
</script>
