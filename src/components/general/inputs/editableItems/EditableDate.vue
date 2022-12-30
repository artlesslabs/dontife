<template>
  <template
    v-if="!hideOnEdit || !editable"
  >
    <div
      v-if="loading || editable"
      class="col-auto editable-date-container"
    >
      <q-skeleton
        v-if="loading"
        width="100%"
        type="QInput"
        class="q-mb-md q-ml-sm"
      />
      <DefaultDate
        v-else-if="editable"
        :label="label"
        v-bind="$attrs"
        :model-value="modelValue"
        @update:model-value="( evt ) => $emit( 'update:modelValue', evt )"
      />
    </div>
    <VisualizationItem
      v-else
      v-bind="props"
      :label="label"
      :value="isArray( modelValue ) ? modelValue.map( ( el )=> formatDateInput( el, visualizationFormat ) ).join( ', ' ): formatDateInput( modelValue, visualizationFormat )"
    />
  </template>
</template>

<script setup>
import DefaultDate from 'components/general/inputs/DefaultDate.vue';
import VisualizationItem from 'components/general/VisualizationItem.vue';
import { isArray } from 'lodash';
import { formatDateInput } from '@/helpers.js';


let props = defineProps( {
  width: { type: String, default: 'auto' },
  loading: { type: Boolean, default: false },
  labelColor: { type: String, default: '$primary' },
  dateColor: { type: String, default: '' },
  visualizationFormat: { type: [ String, Function ], default: 'MM/DD/YYYY', required: false },
  row: { type: Boolean, default: true },
  label: { type: String, default: '' },
  editable: { type: Boolean, default: false },
  multiple: { type: Boolean, default: false },
  modelValue: { type: String, default: '' },
  hideOnEdit: { type: Boolean, default: false }
} );

defineEmits( [ 'update:modelValue' ] );

</script>

<style lang="scss" scoped>
.editable-date-label{
  font-weight: 500;
  width: 120px;
}
.editable-date-field{
}
.editable-date-container{
  width: v-bind( 'width' );
}

</style>
