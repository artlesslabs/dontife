<template>
  <DefaultList
    ref="usersList"
    v-model:selected="selected"
    v-model="users"
    :find-function="userStore.find.bind( userStore )"
    :actions="actions"
    user
    selection="multiple"
    row-key="id"
    :cols="cols"
    @row-click="( evt, row )=>goToUserView( row )"
  />
  <ActionConfirmation
    v-model="confirmDialog"
    :confirm-handler="deleteSelected"
    :cancel-handler="()=>{ confirmDialog = !confirmDialog }"
  />
</template>

<script setup>
import DefaultList from 'components/general/lists/DefaultList.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ActionConfirmation from 'components/general/ActionConfirmation.vue';
import { useUserStore } from 'stores/userStore.js';
import { useI18n } from "vue-i18n";

const { t }= useI18n( { useScope: 'global' } );

let confirmDialog = ref( false );

const userStore = useUserStore();
let selected = ref( [] );
let actions = [
  { name: t( 'generalComponents.action.delete' ), type: 'delete', handler: ()=>{ confirmDialog.value = !confirmDialog.value; } },
];
let usersList = ref( null );

//Delete Records
async function deleteSelected(){
  let ids = selected.value.map( ( el )=>el.id );
  for ( const id of ids ){
    await userStore.delete( { id } );
  }
  await usersList.value.fetchRecords();
  confirmDialog.value = false;
  selected.value=[];
}

//Row Click
const router = useRouter();
function goToUserView( row ){
  router.push( { name: 'users.view', params: { id: row.id } } );
}

//Get Users
let users = ref( [] );

let cols = [
  {
    name: 'id',
    label: 'Id',
    align: 'left',
    field: 'id',
    sortable: true
  },
  {
    name: 'username',
    align: 'center',
    label: t( 'user.table.userName' ),
    field: 'username',
    sortable: true
  },
  {
    name: 'email',
    align: 'center',
    label: t( 'user.table.email' ),
    field: 'email',
    sortable: true
  },
  {
    name: 'role',
    align: 'center',
    label: t( 'user.table.role' ),
    field: row => row.role?.name,
    sortable: true
  },
];

</script>

<style scoped>

</style>
