<template>
  <router-view :key="route.fullPath" />
</template>

<script setup>
import { useRoute } from 'vue-router';

let route = useRoute();

</script>
