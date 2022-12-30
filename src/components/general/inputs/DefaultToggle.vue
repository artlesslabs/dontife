<template>
  <div>
    <div>
      <label
        class="label"
        for="toggle"
      >{{ label }}</label>
    </div>
    <q-toggle
      ref="toggle"
      :model-value="modelValue"
      v-bind="$attrs"
      @update:model-value="( val )=>$emit( 'update:modelValue', val )"
    />
  </div>
</template>

<script setup>
defineProps( {
  modelValue: { type: Boolean, default: false },
  label: { type: String, default: '' }
} );

defineEmits( [ 'update:modelValue' ] );

</script>

<style scoped>
.label{font-size: 13px}
</style>
