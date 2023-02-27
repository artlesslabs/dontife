<template>
  <DefaultList
    ref="ordersList"
    v-model:selected="selected"
    v-model="orders"
    selection="multiple"
    :find-function="ordersConnector.find.bind( ordersConnector )"
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



let ordersConnector = new ApiConnector( 'orders' );
let selected = ref( [] );
let ordersList = ref( null );

//Row Click
const router = useRouter();
function goToPeopleView( row ){
  router.push( { name: 'orders.view', params: { id: row.id } } );
}

//Get People
let orders = ref( [] );

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
    name: 'customer.fullname',
    align: 'center',
    filterable: true,
    label: 'Customer',
    field: ( row )=> row.customer?.fullname,
    sortable: true
  },
  {
    name: 'workOrder',
    align: 'center',
    label: 'Work Order',
    filterable: true,
    field: ( row )=> row.workOrder?.number,
    sortable: true
  },
  {
    name: 'trackingNumber',
    align: 'center',
    label: 'Tracking No.',
    filterable: true,
    field: 'trackingNumber',
    sortable: true
  },
  {
    name: 'status',
    align: 'center',
    filterable: true,
    label: 'Status',
    field: 'status',
    sortable: true
  },
];
</script>

<style scoped>

</style>
