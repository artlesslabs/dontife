<template>
  <DefaultCreate
    @submit.prevent="processData()"
  >
    <p class="text-h4 text-capitalize">
      Bulk Create {{ model }}
    </p>
    <DefaultSelect
      v-model="model"
      label="Model"
      :options="modelSelectOptions"
      @update:model-value="( val )=>{ apiConnector=new ApiConnector( val ) }"
    />
    <FileInput
      v-model="csvFile"
      label="CSV File"
    />
    <DefaultButton
      label="Templates"
      button-style="secondary"
      @click="templateDialog = !templateDialog"
    />
  </DefaultCreate>
  <q-dialog
    v-model="dataValidationDialog"
    @hide="closeDataValidationDialog()"
  >
    <q-card v-if="!loading && createdRecords.length === 0">
      <q-table
        v-model:selected="selected"
        bordered
        :columns="activeColumns()"
        :rows="processedData"
        selection="multiple"
        row-key="id"
      >
        <template
          v-for="( column, idx ) of activeColumns()"
          :key="idx"
          #[`body-cell-${column.name}`]="props"
        >
          <q-td>
            <q-popup-edit
              v-slot="scope"
              v-model="props.row[column.name]"
              buttons
              @update:model-value="validateFields( column, props.row )"
            >
              <q-input
                v-model="scope.value"
                :rules="column.rules"
                dense
                autofocus
                counter
              />
            </q-popup-edit>
            <span>{{ props.row[column.name] }}</span>
            <div
              v-for="( error, idy ) of props.row.errors[column.name]"
              :key="idy"
              class="text-negative"
            >
              <p
                v-if="error !== true"
                class="q-ma-none"
              >
                {{ error }}
              </p>
            </div>
          </q-td>
        </template>
      </q-table>
      <DefaultButton
        button-style="primary"
        @click="bulkCreateRecords"
      >
        Save
      </DefaultButton>
      <DefaultButton
        button-style="primary"
        @click="closeDataValidationDialog()"
      >
        Cancel
      </DefaultButton>
    </q-card>
    <q-card v-else-if="loading">
      <q-skeleton
        type="rect"
      />
    </q-card>
    <q-card v-else>
      <q-table
        binary-state-sort
        bordered
        :pagination="{ sortBy: 'error', descending: false }"
        :row-key="( row )=>row.rowId"
        :columns="activeColumns( true )"
        :rows="createdRecords"
      >
        <template
          v-for="( column, idx ) of activeColumns( true )"
          :key="idx"
          #[`body-cell-${column.name}`]="props"
        >
          <q-td>
            <span>{{ props?.row?.[column.name] }}</span>
          </q-td>
        </template>
      </q-table>
      <DefaultButton
        button-style="primary"
        @click="closeDataValidationDialog()"
      >
        Close
      </DefaultButton>
    </q-card>
  </q-dialog>
  <q-dialog v-model="templateDialog">
    <q-card>
      <q-list dense>
        <div class="row justify-center">
          <p class="text-h6">
            Select Template
          </p>
        </div>
        <q-item
          v-for="( template, idx ) in modelSelectOptions"
          :key="idx"
          clickable
          :to="'/public/csvTemplates/'+template.link"
          target="_blank"
        >
          <q-item-section>{{ template.label }}</q-item-section>
        </q-item>
      </q-list>
      <div class="row justify-center">
        <DefaultButton
          button-style="primary"
          @click="cancelCreation()"
        >
          Cancel
        </DefaultButton>
      </div>
    </q-card>
  </q-dialog>
  <ActionConfirmation
    v-model="creationConfirmationDialog"
    :message="creationConfirmationMessage()"
    :cancel-handler="creationConfirmationCancelHandler"
    :confirm-handler="creationConfirmationCreateHandler"
  />
</template>

<script setup>
import DefaultCreate from 'components/general/forms/DefaultCreate.vue';
import FileInput from 'components/general/inputs/FileInput.vue';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import DefaultButton from 'components/general/DefaultButton.vue';
import DefaultSelect from 'components/general/inputs/DefaultSelect.vue';
import Papa from 'papaparse';
import { isBool, isZipCode, rRequired, isNumber, isEmail, isDate } from '@/validationRules.js';
import ActionConfirmation from 'components/general/ActionConfirmation.vue';
import { ApiConnector } from '@/apiConnector.js';
import { formatDateISO, removeEmpty } from '@/helpers.js';
import { uniq } from 'lodash';


let route = useRoute();
let model = ref( route.params.model );
let csvFile = ref( null );
let templateDialog = ref( false );
let dataValidationDialog = ref( false );
let processedData = ref( [] );
let selected = ref( [] );
let creationConfirmationDialog = ref( false );
let loading = ref( false );
let createdRecords = ref( [] );
const modelSelectOptions = [
  {
    label: 'Admin Configuration',
    value: 'adminConfigurarions',
    link: 'bankAccount.csv',
    columns: [
      { name: 'bankName', label: 'Bank Name', field: ( row ) => row.bankName, rules: [ rRequired ] },
      { name: 'holderName', label: 'Holder Name', field: ( row ) => row.holderName },
      { name: 'accountNumber', label: 'Account Number', field: ( row ) => row.accountNumber },
      { name: 'routingNumber', label: 'Routing Number', field: ( row ) => row.routingNumber },
      { name: 'default', label: 'Default', field: ( row ) => row.default, rules: [ isBool ] },
    ]
  },

];
const apiConnector = ref( new ApiConnector( model.value ) );


function creationConfirmationCancelHandler() {
  creationConfirmationDialog.value = false;
}

async function creationConfirmationCreateHandler() {
  creationConfirmationDialog.value = false;
  loading.value = true;
  let columns = activeColumns();
  for( let el of columns ){
    if( el.type === 'date' ){
      for( let item of selected.value ){
        try {
          item[el.name] ? item[el.name] = formatDateISO( item[el.name] ) : undefined;
        }catch ( e ){
          console.log( e );
        }
      }
    }
  }
  let payload = [];
  for ( let el of selected.value ){
    payload.push( removeEmpty( el ) );
  }
  console.log( payload );
  createdRecords.value = await apiConnector.value.bulkCreate( { data: payload } );
  console.log( createdRecords.value );
  loading.value = false;
}

function getErrorCount(){
  return selected.value.filter( ( el ) => Object.keys( el.errors ).length>0 ).length;
}

function creationConfirmationMessage(){
  return getErrorCount() > 0 ?
    `There are ${getErrorCount()} selected records with errors which might not be able to be created.
    Are you sure you want to try to create ${selected.value.length} records?`:
    `Are you sure you want to create ${selected.value.length} records?`;
}

function activeColumns( errors = false ){
  if ( errors ){
    return [
      { name: 'rowId', label: 'Row', field: ( row )=>row.rowId },
      { name: 'error', label: 'Error', field: ( row )=>row.error, sortable: true, sortOrder: 'da' },
      ...modelSelectOptions.filter( ( el )=>el.value===model.value )[0].columns
    ];
  }
  return modelSelectOptions.filter( ( el )=>el.value===model.value )[0].columns;
}

function validateFields( column, el ){
  let colErrors=[];
  if( column.rules && column.rules.length > 0 ) {
    for ( let rule of column.rules ) {
      let validationResult = rule( el[column.name] );
      validationResult !== true ? colErrors.push( validationResult ) : undefined;
    }
    colErrors.length > 0 ? el.errors[column.name] = colErrors : delete el.errors[column.name];
  }
}

const customProcessor = {
  customers( data ){
    let processedData=[];
    let identifiers = uniq( data.map( ( el )=>el.identifier ) );
    for ( let identifier of identifiers ){
      let filteredData = data.filter( ( el )=>el.identifier === identifier );
      let processedRecord = { people: [], bankAccountsData: [] };
      for ( let el of filteredData ){
        let { associationType, firstName, lastName, contactEmail, contactPhone, bankAccountBankName,	bankAccountHolderName,	bankAccountAccountNumber,	bankAccountRoutingNumber, ...rest } = el;
        if ( el.legalName ){
          processedRecord = { ...processedRecord, ...rest };
        }
        if ( el.associationType ){
          processedRecord.people.push( {
            associationType,
            firstName,
            lastName,
            contactEmail,
            contactPhone,
          } );
        }
        if ( el.bankAccountBankName ){
          processedRecord.bankAccountsData.push( {
            bankName: bankAccountBankName,
            holderName: bankAccountHolderName,
            accountNumber: bankAccountAccountNumber,
            routingNumber: bankAccountRoutingNumber
          } );
        }
      }
      processedData.push( processedRecord );
    }
    processedData = processedData.map( ( { properties, administrators, customerContacts, bankAccounts, ...rest } )=>
    {
      return {
        ...rest,
        properties: properties ? properties.split( ',' ):[],
        administrators: administrators ? administrators.split( ',' ):[],
        customerContacts: customerContacts ? customerContacts.split( ',' ):[],
        bankAccounts: bankAccounts ? bankAccounts.split( ',' ):[],
      };
    } );
    return processedData;
  },
  properties( data ){
    let processedData=[];
    for ( let el of data ){
      let processedRecord = {};
      let { homeownerAssociationFeeAmount,	homeownerAssociationFeeYear,	homeownerAssociationFeePaymentPeriodicity,	homeownerAssociationFeePaymentDay, ...rest } = el;
      processedRecord = rest;
      if ( homeownerAssociationFeeAmount ){
        processedRecord.homeownerAssociationFee = {
          feeAmount: homeownerAssociationFeeAmount,
          year: homeownerAssociationFeeYear,
          paymentPeriodicity: homeownerAssociationFeePaymentPeriodicity,
          paymentDay: homeownerAssociationFeePaymentDay,
        };
      }
      processedData.push( processedRecord );
    }
    return processedData;
  }
};

async function processData(){
  let content = await readFile();
  content = content.split( '\n' ).filter( ( el )=>!/^(,| )+$/.test( el ) ).join( '\n' );
  let csvArray = await Papa.parse( content, { header: true, skipEmptyLines: true } ).data;
  csvArray = customProcessor[model.value] ? customProcessor[model.value]( csvArray ) : csvArray;
  csvArray = csvArray.map( ( el, idx ) => { return { ...el, id: idx }; } );
  let modelColumns = modelSelectOptions.filter( ( el )=> el.value === model.value )[0].columns;
  for ( const el of csvArray ) {
    let errors = {};
    for ( const column of modelColumns ) {
      if ( column.rules ){
        let colErrors = [];
        for ( const rule of column.rules ) {
          let validationResult = rule( el[column.name] );
          validationResult !== true ? colErrors.push( validationResult ) : undefined;
        }
        colErrors.length > 0 ? errors[column.name] = colErrors : undefined;
      }
    }
    el.errors = errors;
  }
  processedData.value = csvArray;
  dataValidationDialog.value = true;
}

function bulkCreateRecords(){
  // eslint-disable-next-line no-unused-vars
  let payload = selected.value.map( ( { errors, id, ...rest } )=>{ return { ...rest }; } );
  console.log( payload );
  creationConfirmationDialog.value = true;
}

function readFile(){
  return new Promise( ( resolve, reject ) => {
    const reader = new FileReader();
    reader.onload = ( res ) => {
      resolve( res.target.result );
    };
    reader.onerror = ( err ) => reject( err );
    reader.readAsText( csvFile.value );
  } );
}

function cancelCreation(){
  templateDialog.value = false;
}

function closeDataValidationDialog(){
  dataValidationDialog.value = false;
  createdRecords.value=[];
  processedData.value=[];
  selected.value=[];
  csvFile.value=null;
}
</script>

<style scoped>

</style>
