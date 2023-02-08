<template>
  <DefaultEdit
    v-model:editable="editMode"
    :loading="loading"
    :title="t( 'user.view.title', { id: 1 } )"
    :cancel-edition="cancelEdition"
    :update-function="update"
  >
    <template #default="props">
      <div class="row">
        <ColumnContainer
          :column-title="t( 'user.view.titleInfo' )"
          elevation="2"
        >
          <ColumnSection>
            <EditableText
              v-model="user.username"
              v-bind="props"
              :label="t( 'user.view.userName' )"
            />
            <EditableText
              v-model="user.email"
              v-bind="props"
              :label="t( 'user.view.email' )"
            />
            <EditablePassword
              v-model="user.password"
              v-bind="props"
              :label="t( 'user.view.password' )"
            />
          </ColumnSection>
        </ColumnContainer>
      </div>
      <div class="row">
        <ColumnContainer
          :column-title="t( 'user.view.titleInfo' )"
          elevation="2"
        >
          <ColumnSection>
            <EditableText
              v-model="taxDetail.rfc"
              v-bind="props"
              label="RFC"
            />
            <EditableText
              v-model="taxDetail.legalName"
              v-bind="props"
              label="Legal Name"
            />
            <EditableText
              v-model="taxDetail.street"
              v-bind="props"
              label="Street"
            />
            <EditableText
              v-model="taxDetail.exteriorNumber"
              v-bind="props"
              label="Exterior Number"
            />
            <EditableText
              v-model="taxDetail.interiorNumber"
              v-bind="props"
              label="Interior Number"
            />
            <EditableText
              v-model="taxDetail.settlement"
              v-bind="props"
              label="Settlement"
            />
            <EditableText
              v-model="taxDetail.zip"
              v-bind="props"
              label="Zip Code"
            />
            <EditableText
              v-model="taxDetail.locality"
              v-bind="props"
              label="RFC"
            />
            <EditableText
              v-model="taxDetail.municipality"
              v-bind="props"
              label="Municipality"
            />
            <EditableText
              v-model="taxDetail.state"
              v-bind="props"
              label="State"
            />
          </ColumnSection>
        </ColumnContainer>
        <ActionConfirmation
          v-model="confirmDialog"
          message="Are you sure you want to delete this record?"
          :confirm-handler="deleteRecord"
          :cancel-handler="()=>{ confirmDialog = !confirmDialog }"
        />
      </div>
    </template>
  </DefaultEdit>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue';
import { ApiConnector } from "@/apiConnector.js";
import DefaultEdit from "components/general/forms/DefaultEdit.vue";
import ColumnContainer from "components/general/containers/columnContainer/ColumnContainer.vue";
import ColumnSection from "components/general/containers/columnContainer/ColumnSection.vue";
import EditableText from "components/general/inputs/editableItems/EditableText.vue";
import EditablePassword from "components/general/inputs/editableItems/EditablePassword.vue";
import ActionConfirmation from "components/general/ActionConfirmation.vue";
import { useI18n } from "vue-i18n";
import { useUserStore } from "stores/userStore.js";

let userStore = useUserStore();
const { t }= useI18n( { useScope: 'global' } );
const router = useRouter();
const userConnector = new ApiConnector( 'users' );
const taxDetailConnector = new ApiConnector( 'taxDetails' );
let editMode = ref( false );
let loading = ref( false );
let confirmDialog = ref( false );


//Get Route Params
const route = useRoute();
let id = ref( route.params.id );

async function deleteRecord(){
  await userConnector.delete( { id: id.value } );
  confirmDialog.value = false;
  router.push( { name: 'users.list' } );
}

//Get User Data
let user = ref( {} );
let taxDetail = ref( {} );

const findUserErrorActions = [
  {
    label: "Try again",
    class: 'q-mx-xs',
    color: 'white',
    rounded: true,
    outline: true,
    handler: ()=>findUser(),
  },
  {
    label: "Go to list view",
    class: 'q-mx-xs',
    color: 'white',
    rounded: true,
    flat: true,
    handler: ()=>router.go( -1 ),
  }
];
async function findUser(){
  taxDetail.value = ( await taxDetailConnector.find( { filters: { person: userStore.user?.person?.id } } ) ).data[0];
  if( taxDetail.value.id ){
    taxDetail.value;
  }else{
    taxDetail.value= {};
  }
  console.log( taxDetail.value );
  user.value = await userConnector.findOne( { id: 1, errorActions: findUserErrorActions } );
}
findUser();

</script>

<style scoped>

</style>
