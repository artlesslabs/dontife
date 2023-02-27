<template>
  <DefaultEdit
    v-model:editable="editMode"
    :loading="loading"
    :title="t( 'people.view.title', { id: id } )"
    :delete-function="deleteRecord"
    :cancel-edition="cancelEdition"
    :update-function="update"
  >
    <template #default="props">
      <div class="flex">
        <ColumnContainer
          :column-title="t( 'people.view.titleInfo' )"
          elevation="4"
        >
          <ColumnSection>
            <EditableText
              v-model="people.firstName"
              v-bind="props"
              :label="t( 'people.view.firstName' )"
            />
            <EditableText
              v-model="people.lastName"
              v-bind="props"
              :label="t( 'people.view.lastName' )"
            />
            <EditableText
              v-model="people.contactEmail"
              v-bind="props"
              :label="t( 'people.view.contactEmail' )"
            />
            <EditableText
              v-model="people.contactPhone"
              v-bind="props"
              :label="t( 'people.view.contactPhone' )"
            />
          </ColumnSection>
        </ColumnContainer>
      </div>
    </template>
  </DefaultEdit>
</template>

<script setup>

import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue';
import { ApiConnector } from '@/apiConnector.js';
import EditableText from 'components/general/inputs/editableItems/EditableText.vue';
import DefaultEdit from 'components/general/forms/DefaultEdit.vue';
import { useI18n } from "vue-i18n";
import ColumnContainer from "components/general/containers/columnContainer/ColumnContainer.vue";
import ColumnSection from "components/general/containers/columnContainer/ColumnSection.vue";

const { t }= useI18n( { useScope: 'global' } );

const router = useRouter();
const peopleConnector = new ApiConnector( 'people' );
let editMode = ref( false );
let loading = ref( false );

//Delete Record
async function deleteRecord(){
  await peopleConnector.delete( { id: id.value } );
  router.push( { name: 'people.list' } );
}

//Get Route Params
const route = useRoute();
let id = ref( route.params.id );

//Get People Data
let people = ref( { data: {} } );

const findPersonErrorActions = [
  {
    label: "Try again",
    class: 'q-mx-xs',
    color: 'white',
    rounded: true,
    outline: true,
    handler: ()=>findPerson(),
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

async function findPerson(){
  loading.value = true;
  people.value = await peopleConnector.findOne( { id: id.value, errorActions: findPersonErrorActions } );
  loading.value = false;
}
findPerson();

//Update Person Data

async function cancelEdition(){
  await findPerson();
  editMode.value = false;
}

const UpdatePersonErrorActions = [
  {
    label: "Try again",
    class: 'q-mx-xs',
    color: 'white',
    rounded: true,
    outline: true,
    handler: ()=>update(),
  },
  {
    label: "Cancel",
    class: 'q-mx-xs',
    color: 'white',
    rounded: true,
    flat: true,
    handler: ()=>{
      editMode.value=false;
      findPerson();
    },
  }
];

async function update(){
  await peopleConnector.update( {
    data: people.value,
    postUpdateHandler: ()=>{ editMode.value = false; findPerson(); },
    actions: UpdatePersonErrorActions,
  } );
}

</script>

<style scoped>

</style>
