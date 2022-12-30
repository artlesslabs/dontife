<template>
  <div class="row items-center">
    <label class="label">{{ label }}</label>
    <q-checkbox
      v-bind="$attrs"
      :model-value="modelValue"
      @update:model-value="( el )=>$emit( 'update:modelValue', el )"
    />
  </div>
</template>

<script setup>

defineProps( {
  label: { type: [ String, undefined ], default: undefined, required: false },
  modelValue: { type: Boolean, default: false, required: true },
} );
defineEmits( [ 'update:modelValue' ] );

</script>

<style scoped>
.label{font-size: 13px}
</style>
