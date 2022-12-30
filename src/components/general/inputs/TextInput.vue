<template>
  <DefaultInput
    ref="defaultInput"
    :required="required"
    :rules="rules"
    :label="label"
    :dense="dense"
    type="text"
  >
    <template
      v-for="( _, slot ) in $slots"
      #[slot]
    >
      <slot
        :name="slot"
      />
    </template>
  </DefaultInput>
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
} );
</script>

<style scoped>

</style>
