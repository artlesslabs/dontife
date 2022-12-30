<template>
  <q-tooltip :offset="offset">
    <slot />
  </q-tooltip>
</template>

<script setup>
defineProps( {
  offset: { type: Array, default: () => [ 0, 5 ] }
} );
</script>

<style scoped>

</style>
