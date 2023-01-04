<template>
  <div class="default-list-container q-pa-sm">
    <div class="button row justify-between">
      <div>
        <DefaultButton
          flat
          color="primary"
          label="Filters"
        >
          <q-badge
            v-if="_.isObject( appliedFilters ) ? !_.isEmpty( appliedFilters ) : !!appliedFilters"
            color="red"
            floating
          >
            {{ appliedFilterCount() }}
          </q-badge>
          <q-menu @keydown.enter.prevent="executeFilter">
            <q-item>
              <TextInput
                v-model="filters.searchString"
                label="Search"
                hide-bottom-space
              />
            </q-item>
            <q-item
              v-for="( field, idx ) of filterableFields"
              :key="idx"
            >
              <DefaultSelect
                v-if="field.filterConfig?.type === 'select'"
                v-model="filters[field.name]"
                :label="field.filterConfig?.label ? field.filterConfig.label : field.label"
                :options="field.filterConfig.options"
                hide-bottom-space
              />
              <DefaultSelect
                v-else-if="field.filterConfig?.type === 'multipleValues'"
                v-model="filters[field.name]"
                multiple
                input-debounce="0"
                use-input
                use-chips
                hide-dropdown-icon
                :label="field.filterConfig?.label ? field.filterConfig.label : field.label"
                new-value-mode="add-unique"
                hide-bottom-space
              />
              <NumberInput
                v-else-if="field.filterConfig?.type === 'number'"
                v-model="filters[field.name]"
                :label="field.filterConfig?.label ? field.filterConfig.label : field.label"
                hide-bottom-space
              />
              <DefaultCheckbox
                v-else-if="field.filterConfig?.type === 'checkbox'"
                v-model="filters[field.name]"
                :label="field.filterConfig?.label ? field.filterConfig.label : field.label"
                hide-bottom-space
              />
              <DefaultToggle
                v-else-if="field.filterConfig?.type === 'toggle'"
                v-model="filters[field.name]"
                :label="field.filterConfig?.label ? field.filterConfig.label : field.label"
                hide-bottom-space
              />
              <DefaultDate
                v-else-if="field.filterConfig?.type === 'date'"
                v-model="filters[field.name]"
                :default-today="false"
                :label="field.filterConfig?.label ? field.filterConfig.label : field.label"
                hide-bottom-space
              />
              <TextInput
                v-else
                v-model="filters[field.name]"
                :label="field.filterConfig?.label ? field.filterConfig.label : field.label"
                hide-bottom-space
              />
            </q-item>
            <q-item class="row justify-between">
              <DefaultButton
                button-style="secondary"
                margin="q-my-sm"
                :rounded="false"
                @click="executeFilter"
              >
                Apply
              </DefaultButton>
              <DefaultButton
                button-style="delete"
                :rounded="false"
                @click="clearFilters"
              >
                Clear Filters
              </DefaultButton>
            </q-item>
          </q-menu>
        </DefaultButton>
      </div>
      <div>
        <DefaultButton
          v-if="exportConfig.enabled"
          button-style="secondary"
          label="Export"
          flat
          :rounded="false"
        >
          <q-menu>
            <q-item
              v-if="table.selected.length"
              dense
            >
              <DefaultCheckbox
                v-model="exportSelected"
                class="q-my-xs"
                label="Only Selected"
                size="xs"
              />
            </q-item>
            <q-item
              dense
              clickable
              @click="exportData( 'table' )"
            >
              <q-item-section class="text-center q-my-sm">
                <span>Table view</span>
              </q-item-section>
            </q-item>
            <q-item
              dense
              clickable
              @click="exportData( )"
            >
              <q-item-section class="text-center q-my-sm">
                <span>Full data</span>
              </q-item-section>
            </q-item>
          </q-menu>
        </DefaultButton>
        <DefaultButton
          v-for="action in actions"
          :key="action.name"
          :button-style="action.type ? action.type : 'secondary'"
          @click="action.handler"
        >
          {{ action.name }}
        </DefaultButton>
      </div>
    </div>
    <div>
      <q-table
        ref="table"
        v-model:pagination="paginationData"
        :title="title"
        :filter="appliedFilters"
        :rows="modelValue"
        :columns="cols"
        row-key="name"
        v-bind="$attrs"
        table-header-class="bg-grey-8 text-white"
        color="amber"
        @request="fetchRecords"
      >
        <template
          v-for="( _, slot ) of $slots"
          #[slot]="scope"
        >
          <slot
            :name="slot"
            v-bind="scope"
          />
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import DefaultButton from 'components/general/DefaultButton.vue';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import TextInput from 'components/general/inputs/TextInput.vue';
import DefaultSelect from 'components/general/inputs/DefaultSelect.vue';
import NumberInput from 'components/general/inputs/NumberInput.vue';
import DefaultCheckbox from 'components/general/inputs/DefaultCheckbox.vue';
import DefaultToggle from 'components/general/inputs/DefaultToggle.vue';
import { searchQueryBuilder } from '@/helpers.js';
import DefaultDate from 'components/general/inputs/DefaultDate.vue';
import _ from 'lodash';
import Papa from 'papaparse';
import { exportFile, useQuasar } from 'quasar';



let props = defineProps( {
  exportConfig: { type: Object, default: ()=>{ return { enabled: true, customFunction: null, customColumns: null }; }, required: false },
  modelValue: { type: Array, default: ()=>[] },
  cols: { type: Array, default: ()=>[] },
  title: { type: String, default: '' },
  actions: { type: Array, default: ()=>[] },
  findFunction: { type: Function, default: ()=>[] },
} );

let route = useRoute();
const $q = useQuasar();
let exportSelected = ref( false );
let table = ref( null );
let filters = ref( {} );
let appliedFilters = ref( {} );
let paginationData = ref( { page: 1 } );
let filterableFields = computed( ()=> props.cols.filter( ( el )=>el.filterable ) );

if ( route.query ) {
  for ( let key of Object.keys( route.query ) ) {
    filters.value[key] = route.query[key];
    executeFilter();
  }
}

//todo filterType
async function fetchRecords( { pagination, filter } = { pagination: { page: 1, rowsPerPage: 5 }, filter: filters.value } ) {
  let { searchString, ...filters } = filter;
  let processedQuery = searchQueryBuilder( filters, searchString, filterableFields.value );
  try {
    let response = await props.findFunction(
      {
        sort: pagination.sortBy ? `${pagination.sortBy}${pagination.descending?':desc':''}`:undefined,
        filters: processedQuery,
        pagination: {
          page: pagination.page,
          pageSize: pagination.rowsPerPage === 0 ? pagination.rowsNumber : pagination.rowsPerPage,
          withCount: true
        }
      } );
    emit( 'update:modelValue', response.data );
    paginationData.value.sortBy = pagination.sortBy;
    paginationData.value.descending = pagination.descending;
    paginationData.value.rowsPerPage = response.meta.pagination.pageSize;
    paginationData.value.rowsNumber = response.meta.pagination.total;
    paginationData.value.page = response.meta.pagination.page;
  } catch ( e ){
    console.log( e );
  }
}

function exportData( exportType ){
  let dataToExport = JSON.parse( JSON.stringify( exportSelected.value ? table.value.selected : table.value.computedRows ) );
  if ( exportType === 'table' ){
    dataToExport = dataToExport.map( ( el )=>generateTableData( el ) );
  }
  let processedData = dataToExport.map( ( el )=>normalizeData( el ) );
  let csvString = Papa.unparse( processedData, { columns: Object.keys( processedData[0] ).filter( ( el ) => el !== 'createdAt' && el !== 'updatedAt' ) } );
  const status = exportFile( 'table-export.csv', csvString, 'text/csv' );

  if ( status !== true ) {
    $q.notify( {
      message: 'Browser denied file download...',
      color: 'negative',
      icon: 'warning'
    } );
  }
}

function normalizeData( el ){
  for ( let key of Object.keys( el ) ){
    if ( _.isArray( el[key] ) ){
      for ( let idx of el[key].keys() ){
        if ( _.isObject( el[key][idx] ) ){
          el[key][idx] = el[key][idx].id;
        }
      }
    } else if ( _.isObject( el[key] ) ){
      el[key] = el[key].id;
    }
  }
  return el;
}

function generateTableData( el ){
  let processedTableRow = {};
  for ( let col of props.cols ){
    if ( col.field ){
      if ( _.isFunction( col.field ) ){
        processedTableRow[col.label] = col.field( el );
      }else {
        processedTableRow[col.label] = _.get( el, col.field, '' );
      }
    }
  }
  return processedTableRow;
}

function clearFilters(){
  appliedFilters.value = { };
  filters.value = { };
}

function executeFilter(){
  appliedFilters.value = JSON.parse( JSON.stringify( filters.value ) );
}

function appliedFilterCount(){
  if ( !_.isEmpty( appliedFilters.value ) ){
    return Object.keys( appliedFilters.value ).length;
  }
  return '';
}

async function lastPage(){
  await table.value.lastPage();
}

defineExpose( { fetchRecords, lastPage } );

let emit = defineEmits( [ 'update:modelValue' ] );

fetchRecords();

</script>
