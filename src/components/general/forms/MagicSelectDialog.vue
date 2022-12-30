<template>
  <q-dialog
    class="q-pa-md q-gutter-sm"
    :model-value="active"
    @update:model-value="( val )=>$emit( 'update:active', val )"
  >
    <q-card class="create-form q-pa-lg">
      <q-tabs
        v-model="activeTab"
        inline-label
        class="text-primary"
      >
        <q-tab
          v-if="creationFormFields"
          name="create"
          icon="add"
          label="Create"
        />
        <q-tab
          name="search"
          icon="search"
          label="Search"
        />
      </q-tabs>
      <div class="tabs-container">
        <q-form
          v-if="activeTab === 'create'"
          ref="creationForm"
          @submit.prevent="createWrapper()"
        >
          <span class="text-h4">{{ title }}</span>
          <div
            v-for="( field, idx ) of creationFormFields"
            :key="idx"
          >
            <TextInput
              v-if="field.type === 'text'"
              v-model="formData[field.value]"
              margin="q-ma-none"
              :label="field.label"
              :required="field.required"
            />
            <NumberInput
              v-if="field.type === 'number'"
              v-model="formData[field.value]"
              margin="q-ma-none"
              :label="field.label"
            />
            <DefaultDate
              v-if="field.type === 'date'"
              v-model="formData[field.value]"
              margin="q-ma-none"
              :label="field.label"
            />
            <DefaultToggle
              v-if="field.type === 'toggle'"
              v-model="formData[field.value]"
              margin="q-ma-none"
              :label="field.label"
            />
            <FileInput
              v-if="field.type === 'field'"
              v-model="formData[field.value]"
              margin="q-ma-none"
              :label="field.label"
            />
            <PasswordInput
              v-if="field.type === 'pass'"
              v-model="formData[field.value]"
              margin="q-ma-none"
              :label="field.label"
            />
          </div>
          <div
            class="row"
          >
            <DefaultButton
              button-style="primary"
              @click="$emit( 'update:active', !active )"
            >
              Cancel
            </DefaultButton>
            <DefaultButton
              button-style="primary"
              type="submit"
            >
              Save
            </DefaultButton>
          </div>
        </q-form>
        <div
          v-if="activeTab === 'search'"
        >
          <div class="row justify-center">
            <div class="col">
              <div class="row search-field-container">
                <DefaultSelect
                  v-model="selectedFilter"
                  margin="q-ma-none"
                  hide-bottom-space
                  :options="filterOptions"
                  label="Filter Field"
                />
              </div>
              <div class="row search-field-container items-end justify-between">
                <TextInput
                  v-model="filterText"
                  margin="q-ma-none"
                  hide-bottom-space
                  class="field"
                  label="Search String"
                />
                <DefaultButton
                  color="primary"
                  margin="q-ma-none"
                  class="column"
                  round
                  icon="search"
                  @click="fetchData( filterText )"
                />
              </div>
              <div class="table-container q-mt-sm">
                <table class="visualization-table">
                  <tr
                    v-for="( el, idx ) of fetchedData"
                    :key="el.id"
                    style="width: 100%"
                    class="row"
                  >
                    <td
                      class="fetched-element-visualization row items-center justify-between"
                      colspan="100%"
                    >
                      <span style="max-width: calc(100% - 32px)">{{ getRowText( el ) }}</span>
                      <DefaultButton
                        v-if="selectedElements.includes( el[valueField] )"
                        margin="q-ml-sm"
                        color="positive"
                        round
                        height="auto"
                        icon="check"
                        size="8px"
                        @click="removeElement( idx )"
                      />
                      <DefaultButton
                        v-else
                        margin="q-ml-sm"
                        color="primary"
                        round
                        height="auto"
                        icon="add"
                        size="8px"
                        @click="addElement( el )"
                      />
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import TextInput from 'components/general/inputs/TextInput.vue';
import NumberInput from 'components/general/inputs/NumberInput.vue';
import DefaultDate from 'components/general/inputs/DefaultDate.vue';
import DefaultToggle from 'components/general/inputs/DefaultToggle.vue';
import FileInput from 'components/general/inputs/FileInput.vue';
import PasswordInput from 'components/general/inputs/PasswordInput.vue';
import DefaultButton from 'components/general/DefaultButton.vue';
import { computed, ref } from 'vue';
import DefaultSelect from 'components/general/inputs/DefaultSelect.vue';
import _ from 'lodash';
import { ApiConnector } from '@/apiConnector.js';

let selectedFilter = ref( null );
let filterText = ref( '' );
let activeTab = ref( props.defaultActiveTab ? props.defaultActiveTab : props.creationFormFields ? 'create' : 'search' );
let model = ref( props.model ? new ApiConnector( props.model ) : null );
let fetchedData = ref( [] );
let emptyFetch = ref( false );

let props = defineProps( {
  modelValue: { type: Object, default: ()=>{} },
  title: { type: String, default: '' },
  emitValue: { type: Boolean, default: false, required: false },
  defaultActiveTab: { type: [ String, null ], default: null },
  valueField: { type: String, default: 'id', required: false },
  multiple: { type: Boolean, default: false, required: false },
  visualizationText: { type: [ String, Function ], default: ( el )=>el, required: true },
  creationFormFields: { type: [ Array, null ], default: null, required: false },
  creationFunction: { type: [ Function, null ], default: null, required: false },
  active: { type: Boolean, default: false },
  filterOptions: { type: Array, default: ()=>{}, required: true },
  model: { type: String, default: '', required: true },
} );


const formData = ref( {} );

const selectedElements = computed( {
  get() {
    if ( props.multiple ){
      return props.modelValue.map( ( el ) => el[props.valueField] );
    } else {
      return props.modelValue ? [ props.modelValue.id ] : [];
    }
  }
} );


let emit = defineEmits( [ 'update:active', 'update:modelValue' ] );

async function fetchData( filterString ){
  let filter = { filters: {} };
  if ( selectedFilter.value.type === 'date' ){
    let normalizedDate = filterString.replace( /\//g, '-' );
    _.set( filter.filters, selectedFilter.value, { $eq: normalizedDate } );
  } else {
    _.set( filter.filters, selectedFilter.value, { $contains: filterString } );
  }
  fetchedData.value = model.value ? ( await model.value.find( filter ) ).data : ( await props.fetchFunction( filter ) ).data;
  let selectedIds;
  if ( props.multiple ){
    selectedIds = props.modelValue.map( ( el )=>el.id );
  } else{
    selectedIds = props.modelValue ? [ props.modelValue.id ] : [];
  }
  fetchedData.value = fetchedData.value.filter( ( el )=> !selectedIds.includes( el.id ) );
  emptyFetch.value = !fetchedData.value.length > 0;
}

function getRowText( el ){
  return _.isFunction( props.visualizationText ) ? props.visualizationText( el ) : el[props.visualizationText];
}

async function createWrapper(){
  let response = _.isFunction( props.creationFunction ) ? await props.creationFunction( { data: formData.value } ) : await model.value.create( { data: formData.value } );
  if ( props.multiple ) {
    emit( 'update:active' );
    emit( 'update:modelValue', [ ...props.modelValue, response ] );
    formData.value = {};
  } else {
    emit( 'update:active' );
    emit( 'update:modelValue', response );
    formData.value = {};

  }
}

function addElement( el ){
  if ( props.emitValue ){
    if ( props.multiple ){
      emit( 'update:modelValue', [ ...props.modelValue, el[props.valueField] ] );
    } else{
      emit( 'update:modelValue', el[props.valueField] );
    }
  } else{
    if ( props.multiple ){
      emit( 'update:modelValue', [ ...props.modelValue, el ] );
    } else{
      emit( 'update:modelValue', el );
    }
  }
}

function removeElement( idx ){
  if ( props.multiple ){
    emit( 'update:modelValue', props.modelValue.filter( ( el, idz ) => idx !== idz ) );
  } else {
    if ( props.emitValue ) {
      emit( 'update:modelValue', '' );
    } else {
      emit( 'update:modelValue', {} );
    }
  }
}

</script>

<style scoped lang="scss">
.visualization-table{
  margin-top: 8px;
  border-collapse: separate;
  border-radius: 5px;
  td {
    width: 100%;
  }
  & > :not(:last-child) {
    border-bottom: 1px solid #c5c5c5;
  }
}
.fetched-element-visualization{
  padding: 8px;
}

.table-container{
  border-radius: 5px;
  max-height: 300px;
  overflow-y: auto;
  overflow-x: hidden;
}

.tabs-container{
  max-width: 240px;
}

.search-field-container{
  max-width: 230px;
  .field{
    width: 178px!important;
  }
}
</style>
