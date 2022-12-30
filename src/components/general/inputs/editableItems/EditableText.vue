<template>
  <template v-if="!hideOnEdit || !editable">
    <div
      v-if="loading || editable"
      class="editable-text-container"
    >
      <q-skeleton
        v-if="loading"
        width="100%"
        type="QInput"
        class="q-mb-md q-ml-sm"
      />
      <TextInput
        v-else-if="editable"
        :required="required"
        v-bind="{ ...$attrs, ...props }"
        :model-value="modelValue"
        @update:model-value="( evt ) => $emit( 'update:modelValue', evt )"
      />
    </div>
    <VisualizationItem
      v-else
      v-bind="props"
      :label="label"
      :value="modelValue"
    />
  </template>
</template>

<script setup>
import TextInput from 'components/general/inputs/TextInput.vue';
import VisualizationItem from 'components/general/VisualizationItem.vue';

let props = defineProps( {
  width: { type: String, default: 'auto' },
  loading: { type: Boolean, default: false },
  labelColor: { type: String, default: '$primary' },
  required: { type: Boolean, default: false },
  textColor: { type: String, default: '' },
  row: { type: Boolean, default: true },
  label: { type: String, default: '' },
  editable: { type: Boolean, default: false },
  modelValue: { type: String, default: '' },
  hideOnEdit: { type: Boolean, default: false }
} );

defineEmits( [ 'update:modelValue' ] );

</script>

<style lang="scss" scoped>

.editable-text-container{
  width: v-bind( 'width' );
  max-width: 100%;
}

</style>
