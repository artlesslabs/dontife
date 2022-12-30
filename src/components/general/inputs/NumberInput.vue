<template>
  <DefaultInput
    ref="defaultInput"
    :required="required"
    :rules="rules"
    :label="label"
    :dense="dense"
    :max="max"
    :min="min"
    step="any"
    :prefix="prefix"
    type="number"
  />
</template>

<script setup>
import DefaultInput from 'components/general/inputs/DefaultInput.vue';
import { ref } from 'vue';

const defaultInput = ref( null );

function validate(){
  defaultInput.value.validate();
}

function hasError(){
  return defaultInput.value.hasError();
}

defineExpose( { validate, hasError } );

defineProps( {
  required: { type: Boolean, default: false },
  label: { type: String, default: '' },
  dense: { type: Boolean, default: true },
  rules: { type: Array, default: ()=>[] },
  max: { type: [ Number, Boolean ], default: false },
  min: { type: [ Number ], default: 0 },
  prefix: { type: String, default: '' },
} );
</script>

<style scoped>

</style>
