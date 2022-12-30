<template>
  <q-form
    v-if="editable"
    ref="filteredSelect"
    greedy
    class="filtered-select"
    @reset="resetForm"
    @submit="validateFilter( params )"
  >
    <div v-if=" _.isArray( modelValue ) && !_.isEmpty( modelValue ) || !_.isArray( modelValue ) && modelValue || editable">
      <div class="row">
        <div
          v-if="title"
          class="q-ma-sm"
        >
          <p class="text-h6">
            {{ title }}
          </p>
        </div>
        <q-space />
        <DefaultButton
          v-if="createElement && creationFormFields && editable"
          round
          button-style="primary"
          icon="mdi-plus"
          @click="prompt =!prompt"
        >
          <DefaultTooltip>Add record</DefaultTooltip>
        </DefaultButton>
      </div>
      <div
        v-if="editable"
        class="row items-center"
      >
        <DefaultSelect
          v-model="selectedFilter"
          label="Filtered Field"
          width="140px"
          :options="filterFields"
          :emit-value="false"
          required
        />
        <DefaultDate
          v-if="selectedFilter.type === 'date'"
          v-model="params"
        />
        <TextInput
          v-else
          v-model="params"
          label="Search"
        />
        <DefaultButton
          button-style="primary"
          type="submit"
        >
          Find
        </DefaultButton>
        <DefaultButton
          button-style="primary"
          type="reset"
        >
          Clear Filter
        </DefaultButton>
      </div>
      <div
        class="filtered-select-fetched"
      >
        <p class="section-title">
          Fetched Records
        </p>
        <div v-if="fetchedData.length">
          <q-chip
            v-for="( el, idx ) in fetchedData"
            :key="_.get( el, keyField, idx )"
            icon-remove="mdi-plus-circle"
            removable
            @remove="addToModel( idx, el )"
          >
            {{ _.isFunction( labelField ) ? labelField( el ) : _.get( el, labelField, '' ) }}
          </q-chip>
        </div>
        <p
          v-else
          :class="`empty-section-message ${emptyFetch ? 'text-negative' : 'text-primary'}`"
        >
          {{ emptyFetch ? 'No Records Found Matching the Selected Filters' :'No Fetched Records' }}
        </p>
      </div>
      <div class="filtered-select-selected">
        <p
          class="section-title"
        >
          Selected Records
        </p>
        <div v-if="modelValue.length && multiple">
          <q-chip
            v-for="( el, idx ) in modelValue"
            :key="_.get( el, keyField, idx )"
            :removable="editable"
            @remove="()=>{ fetchedData.push( el ); $emit( 'update:modelValue', modelValue.filter( ( el, index )=> index !== idx ) ) }"
          >
            {{ _.isFunction( labelField ) ? labelField( el ) : _.get( el, labelField, '' ) }}
          </q-chip>
        </div>
        <div v-else-if="!_.isEmpty( modelValue )">
          <q-chip
            :removable="editable"
            @remove="removeFromModel()"
          >
            {{ _.isFunction( labelField ) ? labelField( modelValue ) : _.get( modelValue, labelField, '' ) }}
          </q-chip>
        </div>
        <p
          v-else
          :class="`empty-section-message ${errorString ? 'text-negative' : 'text-primary'}`"
        >
          {{ errorString ?? 'No Selected Records' }}
          <q-icon
            v-if="errorString"
            size="sm"
            name="error"
          />
        </p>
      </div>
    </div>
  </q-form>
  <div
    v-else
  >
    <div
      v-if="title"
      class="q-ma-sm"
    >
      <p class="text-h6">
        {{ title }}
      </p>
    </div>
    <template v-if="multiple">
      <div
        class="row"
      >
        <VisualizationTable
          :fields="visualizationFields"
          :value="modelValue"
        />
      </div>
    </template>
    <template v-else>
      <div
        class="row"
      >
        <VisualizationItem
          v-for="( field, idz ) of visualizationFields"
          :key="idz"
          :label="field.label"
          :value="_.isFunction( field.value ) ? field.value( modelValue ) : _.get( modelValue, field.value, '-' )"
        />
      </div>
    </template>
  </div>
  <DialogForm
    ref="creationForm"
    v-model:active="prompt"
    v-model="toCreateElement"
    :fields="creationFormFields"
    :creation-function="createElement"
  />
</template>

<script setup>
import _ from 'lodash';
import TextInput from 'components/general/inputs/TextInput.vue';
import DefaultButton from 'components/general/DefaultButton.vue';
import { ref, watch } from 'vue';
import DefaultSelect from 'components/general/inputs/DefaultSelect.vue';
import DefaultDate from 'components/general/inputs/DefaultDate.vue';
import DefaultTooltip from 'components/general/DefaultTooltip.vue';
import { ApiConnector } from '@/apiConnector.js';
import DialogForm from 'components/general/forms/DialogForm.vue';
import VisualizationItem from 'components/general/VisualizationItem.vue';
import VisualizationTable from 'components/general/VisualizationTable.vue';

const props = defineProps( {
  model: {
    type: [ String, null ],
    default: null,
    validator: function( value ) {
      if ( !value ){
        return;
      }
      return [ 'bankAccounts', 'charges', 'customers', 'evictions', 'homeownerAssociationFees', 'leads', 'leases', 'loans', 'people', 'properties', 'purchaseOperations', 'renovations', 'rentGuarantees', 'salesStaffs', 'services', 'tenants', 'users', 'utilityAccounts', 'utilityInvoices', 'utilityProviders', 'vendors' ].includes( value );
    }
  },
  multiple: { type: Boolean, default: false },
  loading: { type: Boolean, default: false }, //todo
  fetchFunction: { type: Function, default: ()=>{} },
  modelValue: { type: [ Array, Object ], default: ()=>[], required: true },
  filterFields: { type: Array, default: ()=>[] },
  valueField: { type: String, default: 'id' },
  labelField: { type: [ Function, String ], default: 'label' },
  keyField: { type: String, default: null },
  title: { type: String, default: '' },
  titlePrompt: { type: String, default: 'Select' },
  editable: { type: Boolean, default: false },
  rules: { type: Array, default: ()=>[] },
  creationFormFields: { type: [ Array, null ], default: null },
  createFunction: { type: [ Function, null ], default: null },
  visualizationFields: { type: Object, default: ()=>{} },

} );


let params = ref( '' );
let fetchedData = ref( [] );
let selectedFilter = ref( '' );
let filteredSelect = ref();
let emit = defineEmits( [ 'update:modelValue' ] );
let hasErrorValue = ref();
let errorString = ref();
let toCreateElement = ref( {} );
let prompt = ref( false );
let creationForm=ref( null );
let model = ref( props.model ? new ApiConnector( props.model ) : null );
let emptyFetch = ref( false );

async function createElement(){
  let response = model.value ? await model.value.create( { data: toCreateElement.value } ): await props.createFunction( { data: toCreateElement.value } );
  console.log( response );
  if( props.multiple ){
    emit( 'update:modelValue', [ ...props.modelValue, response ] );
  }
  else{
    emit( 'update:modelValue', response );
  }
  toCreateElement.value={};
  prompt.value=false;
}

function validateFilter( params ){
  filteredSelect.value.validate().then( ( success )=>{
    if ( success ) {
      fetchData( params );
    }
  } );
}

function addToModel( idx, el ){
  if ( props.multiple ) {
    fetchedData.value.splice( idx, 1 );
    emit( 'update:modelValue', [ ...props.modelValue, el ] );
  } else {
    fetchedData.value.splice( idx, 1 );
    if ( !_.isEmpty( props.modelValue ) ) {
      fetchedData.value.push( props.modelValue );
    }
    emit( 'update:modelValue', el );
  }
}

function removeFromModel(){
  fetchedData.value.push( props.modelValue );
  emit( 'update:modelValue', {} );
}

async function fetchData( params ){
  console.log( selectedFilter.value );
  let filter = { filters: {} };
  if ( selectedFilter.value.type === 'date' ){
    let normalizedDate = params.replace( /\//g, '-' );
    _.set( filter.filters, selectedFilter.value, { $eq: normalizedDate } );
  } else {
    _.set( filter.filters, selectedFilter.value, { $contains: params } );
  }
  fetchedData.value = model.value ? ( await model.value.find( filter ) ).data : ( await props.fetchFunction( filter ) ).data;
  let selectedIds = props.multiple ? props.modelValue.map( ( el )=>el.id ):[ props.modelValue.id ];
  fetchedData.value = fetchedData.value.filter( ( el )=> !selectedIds.includes( el.id ) );
  emptyFetch.value = !fetchedData.value.length > 0;
}

function resetForm(){
  selectedFilter.value = '';
  params.value = '';
  fetchedData.value = [];
  filteredSelect.value.resetValidation();
}

function validate(){
  if ( props.rules ){
    for ( const rule of props.rules ){
      let result = rule( props.modelValue );
      console.log( rule( props.modelValue ) );
      if ( result !== true ){
        hasErrorValue.value = true;
        errorString.value = result;
      } else {
        hasErrorValue.value = false;
        errorString.value = null;
      }
    }
  }
}

function hasError(){
  return hasErrorValue.value;
}

defineExpose( { validate, hasError } );

watch( () => props.editable, async()=>{
  fetchedData.value = [];
  resetForm();
} );

</script>

<style scoped lang="scss">
.filtered-select-fetched{
  :deep(i) {
    color: $positive;
  }
}
.filtered-select-selected{
  :deep(i) {
    color: $negative;
  }
}
.section-title{
  margin: 0;
}

.empty-section-message{
  margin: 0 10px;
  color: $negative;
}

</style>
