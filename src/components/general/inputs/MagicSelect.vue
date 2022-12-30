<template>
  <div :class="`magic-select ${margin}`">
    <label class="label">{{ label }}</label>
    <template v-if="multiple">
      <!--      todo arreglar bottom space-->
      <q-field
        dense
        :model-value="modelValue"
        :rules="rules"
        outlined
        class="row field"
      >
        <div
          v-for="( el, idx ) of modelValue"
          :key="idx"
          class="item"
        >
          <div class="row q-pa-xs">
            <q-tooltip
              anchor="top middle"
              self="bottom middle"
            >
              <p
                v-for="( key, idz ) in Object.keys( el )"
                :key="idz"
                class="q-ma-none"
              >
                {{ `${key}:${el[key]}` }}
              </p>
            </q-tooltip>
            <span class="label">{{ _.isFunction( labelField ) ? labelField( el ) : el[labelField] }}</span>
            <DefaultButton
              v-if="editable"
              icon="close"
              class="remove-btn"
              flat
              height="auto"
              size="xs"
              @click="removeElement( el )"
            />
          </div>
        </div>
        <div
          v-if="editable"
          class="add-btn"
        >
          <div
            class="row q-pa-xs"
            style="cursor: pointer"
            @click.prevent="showForm = !showForm"
          >
            <span class="label">{{ addButtonLabel }}</span>
            <q-icon
              name="add"
              class="remove-btn"
              size="xs"
            />
          </div>
        </div>
      </q-field>
    </template>
    <template v-else>
      <q-field
        dense
        :model-value="modelValue"
        :rules="rules"
        outlined
        class="individual-field"
      >
        <template v-if="modelValue">
          <div
            class="individual-item row justify-between"
          >
            <q-tooltip
              anchor="top middle"
              self="bottom middle"
            >
              <p
                v-for="( key, idz ) in Object.keys( modelValue )"
                :key="idz"
                class="q-ma-none"
              >
                {{ `${key}:${modelValue[key]}` }}
              </p>
            </q-tooltip>
            <span class="label">{{ _.isFunction( labelField ) ? labelField( modelValue ) : modelValue[labelField] }}</span>
            <DefaultButton
              v-if="editable"
              icon="close"
              class="remove-btn"
              color="negative"
              flat
              height="auto"
              size="xs"
              @click="removeElement( modelValue )"
            />
          </div>
        </template>
        <div
          v-else
          class="individual-add-btn full-width row justify-between items-center"
          @click.prevent="showForm = !showForm "
        >
          <span>{{ !modelValue && !editable ? 'Nothing Selected' : addButtonLabel }}</span>
          <q-icon
            v-if="editable"
            name="add"
            class="remove-btn"
            size="sm"
            color="primary"
          />
        </div>
      </q-field>
    </template>
  </div>
  <MagicSelectDialog
    v-model:active="showForm"
    :emit-value="emitValue"
    :value-field="valueField"
    :model="model"
    :multiple="multiple"
    :model-value="modelValue"
    :visualization-text="searchVisualizationText"
    :creation-form-fields="creationFormFields"
    :filter-options="filterOptions"
    @update:model-value="( val )=>$emit( 'update:modelValue', val )"
    @close-dialog="showForm = false"
  />
</template>

<script setup>
import DefaultButton from 'components/general/DefaultButton.vue';
import { ref } from 'vue';
import MagicSelectDialog from 'components/general/forms/MagicSelectDialog.vue';
import { ApiConnector } from '@/apiConnector.js';
import { searchQueryBuilder } from '@/helpers.js';
import _ from 'lodash';
//todo agregar visualization
//todo manejar internamente el fetch de update
let showForm = ref( false );

let props = defineProps( {
  editable: { type: Boolean, default: false, required: false },
  margin: { type: String, default: 'q-mr-sm' },
  width: { type: [ Number, String ], default: '230px' },
  multiple: { type: Boolean, default: false, required: false },
  modelValue: { type: [ Array, Object, null ], default: null, required: true },
  creationFormFields: { type: [ Array, null ], default: null, required: false },
  filterOptions: { type: Array, default: ()=>[], required: true },
  searchVisualizationText: { type: [ String, Function ], required: true },
  valueField: { type: [ String, Function ], default: 'id', required: false },
  labelField: { type: [ String, Function ], default: 'label', required: false },
  emitValue: { type: Boolean, default: false, required: false },
  label: { type: String, default: '', required: false },
  model: { type: String, default: '', required: true },
  rules: { type: Array, default: ()=>{}, required: false },
  addButtonLabel: { type: String, default: 'Add', required: false },
} );

let modelConnector = ref( props.model ? new ApiConnector( props.model ) : null );

function removeElement( elToRemove ){
  if ( props.multiple ) {
    emit( 'update:modelValue', props.modelValue.filter( ( el ) => el[props.valueField] !== elToRemove[props.valueField] ) );
  } else {
    emit( 'update:modelValue', null );
  }
}

if ( props.modelValue ){
  if ( _.isArray( props.modelValue ) && !_.isEmpty( props.modelValue ) ){
    if ( parseInt( props.modelValue[0] ) == props.modelValue[0] ){
      fetchRecords( { pagination: { page: 1, rowsPerPage: 10000 }, filter: { id: props.modelValue } } );
    }
  } else if ( parseInt( props.modelValue ) == props.modelValue ){
    fetchRecords( { pagination: { page: 1, rowsPerPage: 10000 }, filter: { id: props.modelValue } } );
  }
}

async function fetchRecords( { pagination, filter } ) {
  let processedQuery = searchQueryBuilder( filter );
  try {
    let response = await modelConnector.value.find(
      {
        sort: pagination.sortBy ? `${pagination.sortBy}${pagination.descending?':desc':''}`:undefined,
        filters: processedQuery,
        pagination: {
          page: pagination.page,
          pageSize: pagination.rowsPerPage === 0 ? pagination.rowsNumber : pagination.rowsPerPage,
          withCount: true
        }
      } );
    if ( props.multiple ) {
      emit( 'update:modelValue', response.data );
    } else {
      emit( 'update:modelValue', response.data[0] );
    }
  } catch ( e ){
    console.log( e );
  }
}

let emit = defineEmits( [ 'update:modelValue' ] );

</script>

<style lang="scss" scoped>
.magic-select{
  width: v-bind( width );
  font-size: 13px;
  max-width: 230px;

  .label{
    text-transform: capitalize;
  }

  .field{
    min-height: 40px;
    :deep(.q-field__control){
      padding-left: 0;
    }
    :deep(.q-field__control-container){
      padding: 4px 0 0 4px;
      flex-wrap: wrap;
    }
  }
  .item{
    font-size: 13px!important;
    margin: 0 4px 4px 0;
    display: flex;
    flex-direction: column;
    color: $magic-select-text;
    background: $magic-select-bg;
    border-radius: 5px;
    .remove-btn{
      margin: 0;
      padding:0 2px;
    }
    .label{
      padding: 0 2px;
    }
  }
  .add-btn{
    font-size: 13px!important;
    transition: background-color 0.5s cubic-bezier(0.25, 0.8, 0.5, 1);
    font-weight: 400;
    margin: 0 4px 4px 0;
    display: flex;
    flex-direction: column;
    color: #424242;
    border: 1px #b0b0b0 solid;
    background-color: white;
    border-radius: 5px;
    .label{
      padding: 0 2px;
    }
  }
  .add-btn:hover {
    background-color: #c5c5c5!important;
  }

  .individual-field{
    min-height: 40px;
    :deep(.q-field__control){
      padding: 1px;
    }
    :deep(.q-field__control-container){
      flex-wrap: wrap;
    }
    :deep(.q-field__append){
      margin-right: 12px ;
    }
  }

  .individual-add-btn{
    transition: background-color 0.5s cubic-bezier(0.25, 0.8, 0.5, 1);
    padding: 0px 12px;
    font-size: 13px!important;
    font-weight: 400;
    color: #424242;
    cursor: pointer;
    align-content: center;
    border-radius: 4px;
    line-height: 1.5;
  }

  .individual-add-btn:hover {
    background-color: #c5c5c5!important;
  }

  .individual-item{
    font-size: 13px!important;
    color: $magic-select-text;
    background: $magic-select-bg;
    padding: 0 12px;
    width: 100%;
    border-radius: 2px;
    align-content: center;
    .remove-btn{
      margin: 0;
      padding:0 2px;
    }
    .label{
      padding: 0 2px;
    }
  }
}

.error-field{
  line-height: 1;
  min-height: 20px;
  padding: 8px 12px 0;
  font-size: 11px;
}
</style>
