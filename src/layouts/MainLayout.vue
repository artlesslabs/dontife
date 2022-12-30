<template>
  <q-layout
    view="lHh Lpr lFf"
    class="app-container"
  >
    <NavBar v-model:show-sidebar="showSidebar" />
    <div class="sidebar">
      <SideBar
        v-model="showSidebar"
        class="sidebar"
      />
    </div>
    <q-page-container>
      <div>
        <router-view />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import NavBar from 'components/NavBar.vue';
import SideBar from 'components/SideBar.vue';
import { ref } from 'vue';

let showSidebar = ref( false );
</script>

<style lang="scss">

.app-container{
  background: linear-gradient(117.59deg, #40B1F8 0%, #FFFFFF 98.73%);
  .sidebar{
    .q-drawer{
      background-color: transparent!important;
    }
  }

}
</style>
