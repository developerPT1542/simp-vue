
<template>
  <div>
    <nav-bar v-if="!$route.meta.hideNavbar"></nav-bar>
    <router-view />
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue';
export default {
    methods: {},
    components: { NavBar }
};
</script>

<style scoped>

</style>
