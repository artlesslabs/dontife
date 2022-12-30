<template>
  <DefaultEdit
    v-model:editable="editMode"
    :loading="loading"
    :title="t( 'user.view.title', { id: id } )"
    :cancel-edition="cancelEdition"
    :update-function="update"
  >
    <template #default="props">
      <div class="flex">
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
              v-if="editMode"
              v-model="user.password"
              v-bind="props"
              :label="t( 'user.view.password' )"
            />
            <EditableSelect
              v-model="user.role"
              :option-label="( el )=>el.name"
              :option-value="( el )=>el.id"
              label="Role"
              :options="[ { name: 'Administrator', id: 3 } ]"
              v-bind="props"
            />
            <EditableToggle
              v-model="user.confirmed"
              v-bind="props"
              :label="t( 'user.view.confirmed' )"
            />
            <EditableToggle
              v-model="user.blocked"
              v-bind="props"
              :label="t( 'user.view.blocked' )"
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
import ActionConfirmation from 'components/general/ActionConfirmation.vue';
import { useUserStore } from 'stores/userStore.js';
import DefaultEdit from "components/general/forms/DefaultEdit.vue";
import EditableText from "components/general/inputs/editableItems/EditableText.vue";
import EditablePassword from "components/general/inputs/editableItems/EditablePassword.vue";
import EditableToggle from "components/general/inputs/editableItems/EditableToggle.vue";
import { useI18n } from "vue-i18n";
import ColumnContainer from "components/general/containers/columnContainer/ColumnContainer.vue";
import ColumnSection from "components/general/containers/columnContainer/ColumnSection.vue";
import EditableSelect from "components/general/inputs/editableItems/EditableSelect.vue";

const { t }= useI18n( { useScope: 'global' } );


const router = useRouter();
const userStore = useUserStore();
let editMode = ref( false );
let confirmDialog = ref( false );
let loading = ref( false );

//Delete Record
async function deleteRecord(){
  await userStore.delete( { id: id.value } );
  confirmDialog.value = false;
  router.push( { name: 'users.list' } );
}

//Get Route Params
const route = useRoute();
let id = ref( route.params.id );

//Get User Data
let user = ref( {} );

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
  loading.value = true;
  user.value = await userStore.findOne( { id: id.value, errorActions: findUserErrorActions } );
  loading.value = false;
}
findUser();

//Update User Data
async function cancelEdition(){
  await findUser();
  editMode.value = false;
}

const UpdateUserErrorActions = [
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
      findUser();
    },
  }
];

async function update(){
  console.log( user.value );
  await userStore.update( {
    user: user.value,
    postUpdateHandler: ()=>{ editMode.value = false; findUser(); },
    actions: UpdateUserErrorActions,
  } );
  console.log( user.value );
}

</script>

<style scoped>

</style>
