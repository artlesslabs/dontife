<template>
  <q-form
    ref="filteredSelect"
    greedy
    class="filtered-select"
    @reset="resetForm"
    @submit="validateFilter( params )"
  >
    <div v-if=" _.isArray( modelValue ) && !_.isEmpty( modelValue ) || !_.isArray( modelValue ) && modelValue || editMode">
      <p class="text-bold q-ma-none q-mt-md">
        {{ title }}
      </p>
      <div
        v-if="editMode"
        class="row"
      >
        <DefaultSelect
          v-model="selectedFilter"
          label="Filtered Field"
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
        v-if="editMode"
        class="filtered-select-fetched"
      >
        <p class="section-title">
          Fetched Records
        </p>
        <div v-if="fetchedData.length">
          <q-chip
            v-for="( el, idx ) in fetchedData"
            :key="_.get( el, responseKeyField, idx )"
            icon-remove="mdi-plus-circle"
            removable
            @remove="addToModel( idx, el )"
          >
            {{ _.isFunction( responseLabelField ) ? responseLabelField( el ) : _.get( el, responseLabelField, '' ) }}
          </q-chip>
        </div>
        <p
          v-else
          class="empty-section-message text-primary"
        >
          No Fetched Records
        </p>
      </div>
      <div class="filtered-select-selected">
        <p
          v-if="editMode"
          class="section-title"
        >
          Selected Records
        </p>
        <div v-if="modelValue.length && multiple">
          <q-chip
            v-for="( el, idx ) in modelValue"
            :key="_.get( el, keyField, idx )"
            :removable="editMode"
            @remove="()=>{ fetchedData.push( el ); $emit( 'update:modelValue', modelValue.filter( ( el, index )=> index !== idx ) ) }"
          >
            {{ _.isFunction( labelField ) ? labelField( el ) : _.get( el, labelField, '' ) }}
          </q-chip>
        </div>
        <div v-else-if="!_.isEmpty( modelValue )">
          <q-chip
            :removable="editMode"
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
      <HorizontalDivider />
    </div>
  </q-form>
</template>

<script setup>
import _ from 'lodash';
import TextInput from 'components/general/inputs/TextInput.vue';
import DefaultButton from 'components/general/DefaultButton.vue';
import { ref, watch } from 'vue';
import DefaultSelect from 'components/general/inputs/DefaultSelect.vue';
import DefaultDate from 'components/general/inputs/DefaultDate.vue';
import HorizontalDivider from 'components/general/HorizontalDivider.vue';
const props = defineProps( {
  multiple: { type: Boolean, default: false },
  fetchFunction: { type: Function, default: ()=>{} },
  modelValue: { type: [ Array, Object ], default: ()=>[] },
  filterFields: { type: Array, default: ()=>[] },
  valueField: { type: String, default: 'id' },
  labelField: { type: [ Function, String ], default: 'label' },
  responseLabelField: { type: [ Function, String ], default: 'label' },
  keyField: { type: String, default: null },
  responseKeyField: { type: String, default: null },
  title: { type: String, default: 'Select' },
  editMode: { type: Boolean, default: false },
  rules: { type: Array, default: ()=>[] }
} );


let params = ref( '' );
let fetchedData = ref( [] );
let selectedFilter = ref( '' );
let filteredSelect = ref();
let emit = defineEmits( [ 'update:modelValue' ] );
let hasErrorValue = ref();
let errorString = ref();

function validateFilter( params ){
  filteredSelect.value.validate().then( ( success )=>{
    if ( success ) {
      fetchData( params );
    } else{
      console.log( 'error' );
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
  let filter;
  if ( selectedFilter.value.type === 'date' ){
    let normalizedDate = params.replace( /\//g, '-' );
    filter = { filters: { [selectedFilter.value.value]: { $eq: normalizedDate } } };
  } else {
    filter = { filters: { [selectedFilter.value.value]: { $contains: params } } };
  }

  fetchedData.value = await props.fetchFunction( filter );
  let selectedIds = props.multiple ? props.modelValue.map( ( el )=>el.id ):[ props.modelValue.id ];
  fetchedData.value = fetchedData.value.filter( ( el )=> !selectedIds.includes( el.id ) );
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

watch( () => props.editMode, async()=>{
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
