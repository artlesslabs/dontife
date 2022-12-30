<template>
  <template v-if="!hideOnEdit || !editable">
    <div
      v-if="loading || editable"
      class="col-auto editable-select-container"
    >
      <q-skeleton
        v-if="loading"
        width="100%"
        type="QInput"
        class="q-mb-md q-ml-sm"
      />
      <DefaultSelect
        v-else-if="editable"
        :options="options"
        :option-value="optionValue"
        :option-label="optionLabel"
        :required="required"
        :multiple="multiple"
        :label="label"
        v-bind="{ ...$attrs, ...props }"
        :model-value="modelValue"
        @update:model-value="( evt ) => $emit( 'update:modelValue', evt )"
      />
    </div>
    <VisualizationTable
      v-else-if="multiple || visualizationFields"
      :fields="visualizationFields"
      :value="multiple ? visualizationValue(): [ visualizationValue() ]"
    />
    <VisualizationItem
      v-else
      :label="label"
      :value="visualizationValue()"
    />
  </template>
</template>

<script setup>
import DefaultSelect from 'components/general/inputs/DefaultSelect.vue';
import VisualizationItem from 'components/general/VisualizationItem.vue';
import VisualizationTable from 'components/general/VisualizationTable.vue';
import _ from 'lodash';

let props = defineProps( {
  width: { type: String, default: 'auto' },
  loading: { type: Boolean, default: false },
  labelColor: { type: String, default: '$primary' },
  selectColor: { type: String, default: '' },
  row: { type: Boolean, default: true },
  required: { type: Boolean, default: false },
  multiple: { type: Boolean, default: false },
  options: { type: Array, default: ()=>[ {} ] },
  optionLabel: { type: [ Function, String ], default: 'label' },
  optionValue: { type: [ Function, String ], default: 'value' },
  label: { type: String, default: '' },
  editable: { type: Boolean, default: false },
  visualizationFields: { type: [ Array, Boolean ], default: false },
  modelValue: { type: [ String, Array ], default: '' },
  hideOnEdit: { type: Boolean, default: false }
} );

defineEmits( [ 'update:modelValue' ] );


function visualizationValue(){
  if ( props.modelValue && props.options ) {
    let value;
    if ( _.isArray( props.modelValue ) ) {
      if ( _.isObject( props.modelValue[0] ) ) {
        if ( _.isFunction( props.optionValue ) ) {
          value = props.modelValue.map( ( el ) => props.optionValue( el ) );
        } else {
          value = props.modelValue.map( ( el ) => el[props.optionValue] );
        }
      } else {
        value = props.modelValue;
      }
    } else {
      if ( _.isObject( props.modelValue ) ) {
        if ( _.isFunction( props.optionValue ) ) {
          value = props.optionValue( props.modelValue );
        } else {
          value = props.modelValue[props.optionValue];
        }
      } else {
        value = props.modelValue;
      }
    }

    let filteredOptions;

    if ( _.isArray( value ) ) {
      if ( _.isFunction( props.optionValue ) ) {
        return props.options.filter( ( el ) => value.includes( props.optionValue( el ) ) );
      } else {
        return props.options.filter( ( el ) => value.includes( el[props.optionValue] ) );
      }
    } else {
      if ( _.isFunction( props.optionValue ) ) {
        filteredOptions = props.options.filter( ( el ) => value === props.optionValue( el ) )[0];
      } else {
        filteredOptions = props.options.filter( ( el ) => value === el[props.optionValue] )[0];
      }
    }

    if ( !props.visualizationFields ) {
      if( _.isFunction( props.optionLabel ) ) {
        return props.optionLabel( filteredOptions );
      } else {
      return filteredOptions[props.optionLabel];
      }
    } else {
      return filteredOptions;
    }
  }
}

</script>

<style lang="scss" scoped>
.editable-select-container{
  width: v-bind( 'width' );
}

</style>
