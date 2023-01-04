<template>
  <DefaultList
    ref="leadsList"
    v-model:selected="selected"
    v-model="leads"
    :find-function="leadConnector.find.bind( leadConnector )"
    :actions="actions"
    selection="multiple"
    row-key="id"
    :cols="cols"
    @row-click="( evt, row )=>goToLeadsView( row )"
  />
  <ActionConfirmation
    v-model="confirmDialog"
    :confirm-handler="deleteSelected"
    :cancel-handler="()=>{ confirmDialog = !confirmDialog }"
  />
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import DefaultList from "components/general/lists/DefaultList.vue";
import ActionConfirmation from 'components/general/ActionConfirmation.vue';
import { ApiConnector } from '@/apiConnector.js';
import { useI18n } from "vue-i18n";

const { t }= useI18n( { useScope: 'global' } );

let confirmDialog = ref( false );

let leadConnector = new ApiConnector( 'leads' );
let selected = ref( [] );
let actions = [
  { name: t( 'generalComponents.action.delete' ), type: 'delete', handler: ()=>{ confirmDialog.value = !confirmDialog.value; } },
];
let leadsList = ref( null );

//Delete Records
async function deleteSelected(){
  console.log( selected.value );
  let ids = selected.value.map( ( el )=>el.id );
  for ( const id of ids ){
    await leadConnector.delete( { id } );
  }
  await leadsList.value.fetchRecords();
  confirmDialog.value = false;
  selected.value=[];
}

//Row Click
const router = useRouter();
function goToLeadsView( row ){
  router.push( { name: 'leads.view', params: { id: row.id } } );
}

//Get Leads
let leads = ref( [] );
let typeOptions = { legalEntity: 'Legal Entity', individual: 'Individual' };


let cols = [
  {
    name: 'id',
    label: 'Id',
    align: 'left',
    filterable: true,
    filterConfig: { type: 'number' },
    field: row => row.id,
    sortable: true
  },
  {
    name: 'type',
    align: 'center',
    filterable: true,
    filterConfig: { type: 'select', options: [ { label: t( 'lead.create.options.legalEntity' ), value: 'legalEntity' }, { label: t( 'lead.create.options.individual' ), value: 'individual' } ] },
    label: t( 'lead.tableLead.type' ),
    sortable: true,
    field: row => typeOptions[row.type],
  },
  {
    name: 'name',
    align: 'center',
    filterable: true,
    label: t( 'lead.tableLead.name' ),
    field: row => `${row.data.firstName} ${row.data.lastName}`,
    sortable: true
  },
  {
    name: 'email',
    align: 'center',
    filterable: true,
    label: t( 'lead.tableLead.email' ),
    field: row => row.data.email,
    sortable: true
  },
  {
    name: 'phone',
    align: 'center',
    filterable: true,
    label: t( 'lead.tableLead.phone' ),
    field: row => row.data.phone,
    sortable: true
  },
  {
    name: 'status',
    align: 'center',
    filterable: true,
    filterConfig: { type: 'select', options: [ { label: t( 'lead.create.status' ), value: 'created' } ] },
    label: t( 'lead.tableLead.status' ),
    field: row => row.status,
    sortable: true
  },
];

</script>

<style scoped>

</style>
