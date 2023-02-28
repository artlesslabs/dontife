<template>
  <div
    v-if="category==='protesis'"
    class="row items-center"
  >
    <q-card
      class="row my-card items-center justify-center"
      @click="$emit( 'subcategoryClick', 'coronas' )"
    >
      <p class="text-h6">
        Coronas
      </p>
      <q-img
        class="bg-img"
        src="@/assets/corona.png"
      />
    </q-card>
    <q-card
      class="row my-card items-center justify-center"
      @click="$emit( 'subcategoryClick', 'puentes' )"
    >
      <p class="text-h6">
        Puentes
      </p>
    </q-card>
    <q-card
      class="row my-card items-center justify-center"
      @click="$emit( 'subcategoryClick', 'incrustaciones' )"
    >
      <p class="text-h6">
        Inscrustaciones
      </p>
    </q-card>
    <q-card
      class="row my-card items-center justify-center"
      @click="$emit( 'subcategoryClick', 'carillas' )"
    >
      <p class="text-h6">
        Carillas
      </p>
    </q-card>
    <q-card
      class="row my-card items-center justify-center"
      @click="$emit( 'subcategoryClick', 'coronasSobreImplantes' )"
    >
      <p class="text-h6">
        Coronas sobre implantes
      </p>
    </q-card>
  </div>
  <div
    v-if="category==='guardas'"
    class="row items-center"
  >
    <q-card
      class="row my-card items-center justify-center"
      @click="$emit( 'subcategoryClick', 'alineadores' )"
    >
      <p class="text-h6">
        Alineadores
      </p>
    </q-card>
    <q-card
      class="row my-card items-center justify-center"
      @click="$emit( 'subcategoryClick', 'silensorSl' )"
    >
      <p class="text-h6">
        Silensor-sl
      </p>
    </q-card>
    <q-card
      class="row my-card items-center justify-center"
      @click="$emit( 'subcategoryClick', 'miorelajantes' )"
    >
      <p class="text-h6">
        Miorelajantes
      </p>
    </q-card>
    <q-card
      class="row my-card items-center justify-center"
      @click="$emit( 'subcategoryClick', 'protectoresDeportivos' )"
    >
      <p class="text-h6">
        Protectores deportivos
      </p>
    </q-card>
  </div>
</template>

<script setup>

defineProps( { category: { type: String } } );

defineEmits( [ 'subcategoryClick' ] );

</script>

<style lang="scss" scoped>

.my-card {
  width: 250px;
  height: 150px;
  cursor: pointer;
  text-align: center;
  border-radius: 15px;
  margin: 10px;
}

.bg-img{
  width: 40px;
  height: auto;
}

</style>
