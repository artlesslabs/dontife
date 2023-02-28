<template>
  <div class="row items-center">
    <q-card
      class="row my-card items-center justify-center"
      @click="$emit( 'categoryClick', 'protesis' )"
    >
      <q-card-section>
        <p class="text-h6">
          Protesis
        </p>
        <q-icon
          name="fa-solid fa-tooth"
          size="32px"
          color="primary"
        />
      </q-card-section>
    </q-card>
    <q-card
      class="row my-card items-center justify-center"
      @click="$emit( 'categoryClick', 'guardas' )"
    >
      <q-card-section>
        <p class="text-h6">
          Guardas
        </p>
        <q-icon
          name="fa-solid fa-teeth"
          size="32px"
          color="primary"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
defineEmits( [ 'categoryClick' ] );

</script>

<style scoped>
.my-card {
  width: 250px;
  height: 150px;
  cursor: pointer;
  text-align: center;
  border-radius: 15px;
  margin: 10px;
}

</style>
