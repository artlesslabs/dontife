<template>
  <div class="bg-grey-4 full-width row items-center justify-between q-px-md">
    <!-- Left Column -->
    <div
      class="col"
    >
      <!--Filter Section-->
      <template v-if="isDesktop">
        <div>
          <DefaultButton
            v-bind="filtersButtonDefinition"
          >
            <q-badge
              v-if="search"
              color="red"
              floating
            />
            <q-menu @keydown.enter.prevent="executeFilter">
              <q-item>
                <TextInput
                  v-model="searchString"
                  label="Search"
                  hide-bottom-space
                />
              </q-item>
              <q-item class="row justify-between">
                <DefaultButton
                  v-bind="applyFilterButtonDefinition"
                  @click="executeFilter"
                />
                <DefaultButton
                  v-bind="clearFilterButtonDefinition"
                  @click="clearFilters"
                >
                  Clear Filters
                </DefaultButton>
              </q-item>
            </q-menu>
          </DefaultButton>
        </div>
      </template>
      <template v-else>
        <div>
          <DefaultButton
            round
            flat
            icon="mdi-dots-vertical"
          >
            <q-menu>
              <q-item dense>
                <DefaultButton
                  margin="0"
                  v-bind="filtersButtonDefinition"
                >
                  <q-badge
                    v-if="search"
                    color="red"
                    floating
                  />
                  <q-menu @keydown.enter.prevent="executeFilter">
                    <q-item>
                      <TextInput
                        v-model="searchString"
                        label="Search"
                        hide-bottom-space
                      />
                    </q-item>
                    <q-item class="row justify-between">
                      <DefaultButton
                        v-bind="applyFilterButtonDefinition"
                        @click="executeFilter"
                      />
                      <DefaultButton
                        v-bind="clearFilterButtonDefinition"
                        @click="clearFilters"
                      >
                        Clear Filters
                      </DefaultButton>
                    </q-item>
                  </q-menu>
                </DefaultButton>
              </q-item>
              <q-item dense>
                <DefaultButton
                  v-if="exportConfig.enabled"
                  margin="0"
                  button-style="secondary"
                  label="Export"
                  flat
                  :rounded="false"
                >
                  <q-menu>
                    <q-item
                      v-if="selectedData.length"
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
                  </q-menu>
                </DefaultButton>
              </q-item>
            </q-menu>
          </DefaultButton>
        </div>
      </template>
      <!-- Title Section -->
      <p
        v-if="title"
        class="text-h6"
      >
        {{ title }}
      </p>
    </div>
    <!-- Right Column -->
    <div
      class="col-auto"
    >
      <!-- Export Section -->
      <DefaultButton
        v-if="exportConfig.enabled && isDesktop"
        button-style="secondary"
        label="Export"
        flat
        :rounded="false"
      >
        <q-menu>
          <q-item
            v-if="selectedData.length"
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
        </q-menu>
      </DefaultButton>
      <!-- Actions Section -->
      <DefaultButton
        v-if="deleteButtonHandler"
        v-bind="deleteButtonDefinition"
        @click="deleteElements"
      >
        <DefaultTooltip>
          {{ deleteButtonTooltip }}
        </DefaultTooltip>
      </DefaultButton>
      <DefaultButton
        v-if="addButtonHandler"
        v-bind="addButtonDefinition"
        @click="addRecord"
      >
        <DefaultTooltip>
          {{ addButtonTooltip }}
        </DefaultTooltip>
      </DefaultButton>
    </div>
  </div>
</template>

<script setup>
import DefaultButton from 'components/general/DefaultButton.vue';
import TextInput from 'components/general/inputs/TextInput.vue';
import DefaultCheckbox from 'components/general/inputs/DefaultCheckbox.vue';
import DefaultTooltip from 'components/general/DefaultTooltip.vue';
import _ from 'lodash';
import { computed, ref } from 'vue';
import Papa from 'papaparse';
import { exportFile, useQuasar } from 'quasar';

const isDesktop = computed( ()=>$q.screen.gt.sm );

let props = defineProps( {
  //Export
  exportConfig: { type: Object, default: ()=>{ return { enabled: true }; }, required: false },
  selectedData: { type: Array, default: ()=>[], required: false },
  displayedData: { type: Array, default: ()=>[], required: false },
  exportColumns: { type: [ Array, null ], default: null, required: false },
  //Filters
  filterableFields: { type: Array, default: ()=>[], required: false },
  search: { type: String, default: '', required: false },
  //Actions
  addButtonHandler: { type: [ Function, null ], default: null, required: false },
  deleteButtonHandler: { type: [ Function, null ], default: null, required: false },
  addButtonTooltip: { type: String, default: 'Add record', required: false },
  deleteButtonTooltip: { type: String, default: 'Remove Selected', required: false },
  //Content
  title: { type: [ String, null ], default: null, required: false },
} );

// Quasar

let $q = useQuasar();

// Add Records
const addButtonDefinition = { round: true, buttonStyle: 'primary', icon: 'mdi-plus' };

async function addRecord(){
  if ( props.addButtonHandler ) {
    await props.addButtonHandler();
  }
}


// Delete Elements
const deleteButtonDefinition = { round: true, buttonStyle: 'primary', color: 'negative', icon: 'mdi-delete-sweep' };

async function deleteElements(){
  if ( props.deleteButtonHandler ) {
    await props.deleteButtonHandler( props.selectedData );
  }
}

// Filters
let searchString = ref( '' );
const filtersButtonDefinition = { flat: true, color: "primary", label: "Filters", class: "filter-btn" };
const clearFilterButtonDefinition = { buttonStyle: "delete", rounded: false };
const applyFilterButtonDefinition = { label: 'Apply', buttonStyle: "secondary", margin: "q-my-sm", rounded: false };

function executeFilter(){
  emit( 'update:search', searchString.value );
}
function clearFilters(){
  searchString.value = '';
  emit( 'update:search', searchString.value );
  executeFilter();
}

// Export
let exportSelected = ref( true );
function exportData(){
  let dataToExport;
  if ( exportSelected.value && props.selectedData.length ){
    dataToExport = JSON.parse( JSON.stringify( props.selectedData ) );
  } else {
    dataToExport = JSON.parse( JSON.stringify( props.displayedData ) );
  }
  console.log( props.selectedData );
  if ( props.exportColumns ) {
    dataToExport = dataToExport.map( ( el ) => generateTableData( el ) );
  }
  let processedData = dataToExport.map( ( el ) => normalizeData( el ) );
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

//Helper Functions

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
  for ( let col of props.exportColumns ){
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


let emit = defineEmits( [ 'update:search' ] );
</script>

<style scoped lang="scss">

</style>
