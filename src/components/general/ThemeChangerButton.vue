<template>
  <q-toggle
    color="white"
    :model-value="$q.dark.isActive"
    @click="toggleDark()"
  />
  <q-icon
    class="theme-changer"
    size="sm"
    name="mdi-white-balance-sunny"
  />
</template>

<script setup>
import { useUserStore } from "stores/userStore.js";
import { useQuasar } from "quasar";

let q = useQuasar();
let userStore = useUserStore();

if ( userStore.user.userConfig?.isDark && !q.dark.isActive ){
  q.dark.toggle();
}


async function toggleDark(){
  q.dark.toggle();
  await userStore.update( { user: { id: userStore.user.id, userConfig: { ...userStore.user.userConfig, isDark: q.dark.isActive } } } );
  await userStore.getMe();
}

</script>

<style lang="scss" scoped>
$theme-changer: #081221;
$theme-changer-dark: white;

.theme-changer {
  color: $theme-changer;
}
.body--dark {
  .theme-changer {
    color: $theme-changer-dark;
  }
}
</style>
