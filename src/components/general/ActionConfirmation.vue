<template>
  <q-dialog v-bind="$attrs">
    <q-card>
      <q-card-section>
        <span>{{ message }}</span>
        <q-card-actions>
          <DefaultButton
            button-style="primary"
            @click="confirmHandler"
          >
            {{ t( 'generalComponents.actionConfirmation.confirm' ) }}
          </DefaultButton>
          <DefaultButton
            button-style="primary"
            @click="cancelHandler"
          >
            {{ t( 'generalComponents.actionConfirmation.cancel' ) }}
          </DefaultButton>
        </q-card-actions>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import DefaultButton from 'components/general/DefaultButton.vue';
import { useI18n } from "vue-i18n";

const { t }= useI18n( { useScope: 'global' } );

defineProps( {
  message: { type: String, default: 'Are you sure you want to delete selected records?' },
  confirmHandler: { type: Function, default: ()=>{} },
  cancelHandler: { type: Function, default: ()=>{} }
} );
</script>

<style scoped>

</style>
