<template>
  <q-icon
    class="q-mr-sm"
    size="xl"
    :name="name"
    color="white"
  />
</template>

<script setup>
defineProps( {
  name: { type: String, default: '' }
} );
</script>

<style scoped>

</style>
