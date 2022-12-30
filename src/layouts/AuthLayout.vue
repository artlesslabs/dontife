<template>
  <q-layout class="flex flex-center login-layout-container">
    <q-card class="login-modal flex-center absolute-center">
      <q-card-section :class="`${isDesktop ? 'q-ma-xl' : 'q-mx-md q-my-xl'}`">
        <q-img
          src="@/assets/logo-donti.png"
          fit="contain"
          height="120px"
        />
      </q-card-section>
      <router-view />
    </q-card>
  </q-layout>
</template>

<script setup>
import { useQuasar } from 'quasar';
import { computed } from "vue";

let $q= useQuasar();
const isDesktop = computed( ()=>$q.screen.gt.sm );

</script>

<style lang="scss" scoped>

.background-login{
  max-height: 100%!important;
  max-width: 100%!important;
}

.login-layout-container {
  background-image: url("@/assets/fondo-login.png");
  background-size: cover;
  background-position: center;
}

.login-modal{
  height: 600px;
  width: 500px!important;
  max-width: 100%;
  background-color: rgba(255, 255, 255, 0.44);
  border-radius: 35px;
}

</style>
