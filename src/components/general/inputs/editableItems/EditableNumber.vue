<template>
  <template v-if="!hideOnEdit || !editable">
    <div
      v-if="loading || editable"
      class="col-auto editable-number-container"
    >
      <q-skeleton
        v-if="loading"
        width="100%"
        type="QInput"
        class="q-mb-md q-ml-sm"
      />
      <NumberInput
        v-else-if="editable"
        v-bind="props"
        :required="required"
        :model-value="modelValue"
        :prefix="prefix"
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
import NumberInput from 'components/general/inputs/NumberInput.vue';
import VisualizationItem from 'components/general/VisualizationItem.vue';

let props = defineProps( {
  width: { type: String, default: 'auto' },
  loading: { type: Boolean, default: false },
  labelColor: { type: String, default: '$primary' },
  required: { type: Boolean, default: false },
  numberColor: { type: String, default: '' },
  row: { type: Boolean, default: true },
  label: { type: String, default: '' },
  editable: { type: Boolean, default: false },
  modelValue: { type: Number, default: 0 },
  hideOnEdit: { type: Boolean, default: false },
  prefix: { type: String, default: '' }
} );

defineEmits( [ 'update:modelValue' ] );
//todo fix modelvalue for input
</script>

<style lang="scss" scoped>
.editable-number-container{
  width: v-bind( 'width' );
}

</style>
