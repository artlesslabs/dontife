<template>
  <div
    v-if="!hideOnEdit || !editable"
    class="col-auto editable-password-container"
  >
    <q-skeleton
      v-if="loading"
      width="100%"
      type="QInput"
      class="q-mb-md q-ml-sm"
    />
    <PasswordInput
      v-else-if="editable"
      v-bind="props"
      :model-value="modelValue"
      @update:model-value="( evt ) => $emit( 'update:modelValue', evt )"
    />
    <VisualizationItem
      v-else
      v-bind="props"
      :label="label"
      :value="modelValue"
    />
  </div>
</template>

<script setup>
import PasswordInput from 'components/general/inputs/PasswordInput.vue';
import VisualizationItem from 'components/general/VisualizationItem.vue';

let props = defineProps( {
  width: { type: String, default: 'auto' },
  loading: { type: Boolean, default: false },
  labelColor: { type: String, default: '$primary' },
  passwordColor: { type: String, default: '' },
  row: { type: Boolean, default: true },
  label: { type: String, default: '' },
  editable: { type: Boolean, default: false },
  modelValue: { type: String, default: '' },
  hideOnEdit: { type: Boolean, default: false }
} );

defineEmits( [ 'update:modelValue' ] );

</script>

<style lang="scss" scoped>
.editable-password-container{
  width: v-bind( 'width' );
}

</style>
