<template>
  <DefaultInput
    :rules="rules"
    :label="label ?? t( 'generalComponents.passwordInput.label' )"
    :dense="dense"
    :type=" hidePassword ? 'password':'text'"
  >
    <template #append>
      <q-icon
        :name="hidePassword ? 'visibility_off':'visibility'"
        class="cursor-pointer"
        @click="hidePassword = !hidePassword"
      />
    </template>
  </DefaultInput>
</template>

<script setup>
import DefaultInput from 'components/general/inputs/DefaultInput.vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

defineProps( {
  label: { type: String, default: null },
  dense: { type: Boolean, default: true },
  rules: { type: Array, default: ()=>[] },
} );

let hidePassword = ref( true );

</script>

<style scoped>

</style>
