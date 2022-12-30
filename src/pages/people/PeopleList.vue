<template>
  <DefaultList
    ref="peopleList"
    v-model:selected="selected"
    v-model="people"
    :actions="actions"
    selection="multiple"
    :find-function="peopleConnector.find.bind( peopleConnector )"
    row-key="id"
    :cols="cols"
    @row-click="( evt, row )=>goToPeopleView( row )"
  />
</template>

<script setup>
import DefaultList from 'components/general/lists/DefaultList.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { ApiConnector } from '@/apiConnector.js';
import { useI18n } from "vue-i18n";

const { t }= useI18n( { useScope: 'global' } );


let peopleConnector = new ApiConnector( 'people' );
let selected = ref( [] );
let peopleList = ref( null );

//Row Click
const router = useRouter();
function goToPeopleView( row ){
  router.push( { name: 'people.view', params: { id: row.id } } );
}

//Get People
let people = ref( [] );

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
    name: 'fullname',
    align: 'center',
    label: 'Name',
    filterable: true,
    field: 'fullname',
    sortable: true
  },
  {
    name: 'contactEmail',
    align: 'center',
    filterable: true,
    label: t( 'people.table.contactEmail' ),
    field: row => row.contactEmail,
    sortable: true
  },
  {
    name: 'contactPhone',
    align: 'center',
    filterable: true,
    label: t( 'people.table.contactPhone' ),
    field: row => row.contactPhone,
    sortable: true
  },
];
</script>

<style scoped>

</style>
