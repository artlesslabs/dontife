<template>
  <div class="fullscreen bg-active-dark-gray text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">
        403
      </div>

      <div
        class="text-h2"
        style="opacity:.4"
      >
        You're not allowed into this section, if you think this is an error please contact an administrator.
      </div>

      <DefaultButton
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        to="/"
        label="Go Home"
        no-caps
      />
      <DefaultButton
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        label="logout"
        no-caps
        @click="logout"
      />
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "stores/userStore.js";
import DefaultButton from "components/general/DefaultButton.vue";

let userStore = useUserStore();

function logout(){
  userStore.logout();
}
</script>
