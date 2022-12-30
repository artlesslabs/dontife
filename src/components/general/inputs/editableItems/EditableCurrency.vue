<template>
  <template v-if="!hideOnEdit || !editable">
    <div
      v-if="loading || editable"
      class="col-auto editable-text-container"
    >
      <q-skeleton
        v-if="loading"
        width="100%"
        type="QInput"
        class="q-mb-md q-ml-sm"
      />
      <CurrencyInput
        v-else-if="editable"
        v-bind="{ ...$attrs, ...props }"
        :model-value="modelValue"
        @update:model-value="( evt ) => $emit( 'update:modelValue', evt )"
      />
    </div>
    <VisualizationItem
      v-else
      v-bind="props"
      :label="label"
      :value="currencyFormatter.format( modelValue )"
    />
  </template>
</template>

<script setup>
import VisualizationItem from 'components/general/VisualizationItem.vue';
import CurrencyInput from 'components/general/inputs/CurrencyInput.vue';
import { inject } from 'vue';

let props = defineProps( {
  width: { type: String, default: 'auto' },
  loading: { type: Boolean, default: false },
  labelColor: { type: String, default: '$primary' },
  textColor: { type: String, default: '' },
  row: { type: Boolean, default: true },
  label: { type: String, default: '' },
  editable: { type: Boolean, default: false },
  modelValue: { type: [ Number, String ], default: '' },
  hideOnEdit: { type: Boolean, default: false }
} );

let currencyFormatter = inject( 'currencyFormatter' );

defineEmits( [ 'update:modelValue' ] );

</script>

<style lang="scss" scoped>

.editable-text-container{
  width: v-bind( 'width' );
}

</style>
