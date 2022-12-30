<template>
  <div class="row justify-center">
    <DefaultList
      ref="profilesList"
      v-model:selected="selected"
      v-model="profiles"
      card-class="utility-type-card"
      :cols="cols"
      :find-function="profilesConnector.find.bind( profilesConnector )"
      selection="single"
      class="type-table"
      row-key="id"
    >
      <template
        #top
      >
        <div class="row full-width justify-end">
          <DefaultButton
            round
            button-style="primary"
            icon="mdi-delete-sweep"
            color="negative"
            @click="deleteElements( selected )"
          >
            <DefaultTooltip>Remove Selected</DefaultTooltip>
          </DefaultButton>
          <DefaultButton
            round
            button-style="primary"
            icon="mdi-plus"
            @click="addRecord"
          >
            <DefaultTooltip>Add record</DefaultTooltip>
          </DefaultButton>
        </div>
      </template>
      <template
        #body-cell-actions="data"
      >
        <q-td
          class="justify-end"
          :props="data"
        >
          <DefaultButton
            margin="q-mx-sm"
            button-style="secondary"
            round
            size="sm"
            height="auto"
            icon="mdi-pencil"
            @click="edit( data.row )"
          >
            <DefaultTooltip>Edit</DefaultTooltip>
          </DefaultButton>
          <DefaultButton
            margin="q-mx-sm"
            button-style="secondary"
            round
            size="sm"
            height="auto"
            color="negative"
            icon="mdi-delete"
            @click="deleteElements( [ data.row ] )"
          >
            <DefaultTooltip>
              Delete
            </DefaultTooltip>
          </DefaultButton>
        </q-td>
      </template>
      <template #body-cell-active="props">
        <q-td :props="props">
          <q-icon
            size="sm"
            :color="props.row.active ? 'positive' : 'negative'"
            :name="props.row.active ? 'mdi-check' : 'mdi-close'"
          />
        </q-td>
      </template>
    </DefaultList>
  </div>
  <q-card
    v-if="profile.id"
    class="q-ma-lg"
  >
    <div class="text-white bg-active-dark-gray q-px-md row justify-between items-center">
      <div class="row">
        <div>
          <span>
            {{ profile.name }}
          </span>
          <q-icon
            class="cursor-pointer"
            name="mdi-pencil"
          >
            <q-popup-edit
              v-slot="props"
              v-model="profile.name"
            >
              <TextInput
                v-model="props.value"
                :model-value="props.value"
                label="Name"
              >
                <template #after>
                  <DefaultButton
                    flat
                    margin="0"
                    dense
                    color="negative"
                    icon="cancel"
                    @click.stop.prevent="props.cancel"
                  />

                  <DefaultButton
                    flat
                    dense
                    margin="0"
                    color="positive"
                    icon="check_circle"
                    @click.stop.prevent="props.set"
                  />
                </template>
              </TextInput>
            </q-popup-edit>
          </q-icon>
        </div>
        <span class="q-mx-sm">-</span>
        <div>
          <span><q-tooltip>{{ profile.description }}</q-tooltip>{{ profile.description }}</span>
          <q-icon
            class="cursor-pointer"
            name="mdi-pencil"
          >
            <q-popup-edit
              v-slot="props"
              v-model="profile.description"
            >
              <TextInput
                v-model="props.value"
                :model-value="props.value"
                label="Description"
              >
                <template #after>
                  <DefaultButton
                    flat
                    margin="0"
                    dense
                    color="negative"
                    icon="cancel"
                    @click.stop.prevent="props.cancel"
                  />

                  <DefaultButton
                    flat
                    margin="0"
                    dense
                    color="positive"
                    icon="check_circle"
                    @click.stop.prevent="props.set"
                  />
                </template>
              </TextInput>
            </q-popup-edit>
          </q-icon>
        </div>
      </div>
      <div class="row items-center">
        <div>
          <span
            v-if="profile.active"
            class="text-positive text-bold"
          >
            Active
          </span>
          <span
            v-else
            class="text-negative text-bold"
          >
            Inactive
          </span>
          <q-icon
            class="cursor-pointer"
            name="mdi-pencil"
            @click="profile.active = !profile.active"
          />
        </div>
        <DefaultButton
          button-style="primary"
          @click="update"
        >
          Save
        </DefaultButton>
      </div>
    </div>
    <q-tabs v-model="activeModule">
      <q-tab
        v-for="( module, moduleKey, moduleIdx ) of permissions"
        :key="moduleIdx"
        :name="moduleKey"
      >
        {{ moduleKey }}
      </q-tab>
    </q-tabs>
    <q-tab-panels v-model="activeModule">
      <q-tab-panel
        v-for="( module, moduleKey, moduleIdx ) of permissions"
        :key="moduleIdx"
        :name="moduleKey"
      >
        <table class="permission-table">
          <template
            v-for="( page, pageKey, pageIdx ) of module"
            :key="pageIdx"
          >
            <template
              v-for="( permission, permissionKey, permissionIdx ) of page"
              :key="permissionIdx"
            >
              <tr v-if="( pageIdx === 0 && permissionIdx === 0 ) ||( !permissionIdx && profile.basePermissions[moduleKey] ) || profile.basePermissions[moduleKey]?.[pageKey]">
                <td
                  :class="`${pageIdx !== 0 ? 'td-no-top-border': ''} td-no-bottom-border`"
                >
                  <PermissionElement
                    v-if="pageIdx === 0"
                    v-model="profile.basePermissions[moduleKey]"
                    :value-on-negative-click="{}"
                    :value-on-positive-click="false"
                    :title="moduleKey"
                  />
                </td>
                <td
                  v-if="profile.basePermissions[moduleKey]"
                  :class="`${pageIdx % 2 === 0 ? 'even-permission-cells' : 'odd-permission-cells'} ${permissionIdx !== 0 ? 'td-no-top-border': ''} td-no-bottom-border`"
                >
                  <PermissionElement
                    v-if="permissionIdx === 0"
                    v-model="profile.basePermissions[moduleKey][pageKey]"
                    :value-on-negative-click="[]"
                    :value-on-positive-click="false"
                    :title="pageKey"
                  />
                </td>
                <td
                  v-if="profile.basePermissions[moduleKey]?.[pageKey]"
                  :class="`${pageIdx % 2 === 0 ? 'even-permission-cells' : 'odd-permission-cells'}`"
                >
                  <PermissionElement
                    v-model="profile.basePermissions[moduleKey][pageKey]"
                    :positive-condition="( val )=>val.includes( permissionKey )"
                    :value-on-negative-click="( permissions )=> [ ...permissions, permissionKey ]"
                    :value-on-positive-click="( permissions )=> permissions.filter( ( el )=> el !== permissionKey )"
                    :title="permissionKey"
                  />
                </td>
              </tr>
            </template>
          </template>
        </table>
      </q-tab-panel>
    </q-tab-panels>
  </q-card>
  <q-dialog
    v-model="prompt"
    class="q-pa-md q-gutter-sm"
  >
    <q-card class="create-form q-pa-lg">
      <q-form
        ref="creationForm"
        @reset="onReset"
        @submit.prevent="create()"
      >
        <span class="text-h4">Create Profile</span>
        <TextInput
          v-model="profile.name"
          label="Name"
          required
        />
        <TextInput
          v-model="profile.description"
          label="Description"
          required
        />
        <DefaultToggle
          v-model="profile.active"
          label="Active"
        />
        <div
          class="row"
        >
          <DefaultButton
            button-style="primary"
            @click="cancelCreation()"
          >
            Cancel
          </DefaultButton>
          <DefaultButton
            button-style="primary"
            type="submit"
          >
            Save
          </DefaultButton>
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import DefaultList from 'components/general/lists/DefaultList.vue';
import { ref, watch } from 'vue';
import { ApiConnector } from '@/apiConnector.js';
import DefaultButton from 'components/general/DefaultButton.vue';
import DefaultTooltip from 'components/general/DefaultTooltip.vue';
import TextInput from 'components/general/inputs/TextInput.vue';
import DefaultToggle from 'components/general/inputs/DefaultToggle.vue';
import permissions from '@/permissions/index.js';
import PermissionElement from 'components/permissions/PermissionElement.vue';

let profilesConnector = new ApiConnector( 'profiles' );
let selected = ref( [] );
let profilesList = ref( null );
let creationForm = ref( null );
let prompt = ref( false );
let activeModule = ref( 'customers' );
let profiles = ref( [] );
let profile = ref( { } );

//Delete Records
async function deleteElements( data ){
  let ids = data.map( ( el )=>el.id );
  for ( const id of ids ){
    await profilesConnector.delete( { id } );
  }
  await profilesList.value.fetchRecords();
  selected.value=[];
}

function onReset() {

}

function cancelCreation(){
  prompt.value = false;
}

function addRecord(){
  selected.value = [];
  profile.value = { active: true };
  prompt.value = true;
}

async function create(){
  let createdProfile = await profilesConnector.create( { data: profile.value, postCreateHandle: async()=> { await creationForm.value.reset(); prompt.value=false; } } );
  onReset();
  await profilesList.value.fetchRecords();
  await profilesList.value.lastPage();
  selected.value = [ createdProfile ];
  prompt.value=false;
}

// eslint-disable-next-line no-unused-vars
async function update(){
  console.log( profile.value );
}

//Get Profiles

let cols = [
  {
    name: 'id',
    label: 'Id',
    filterable: true,
    filterConfig: { type: 'multipleValues' },
    align: 'left',
    field: 'id',
    sortable: true
  },
  {
    name: 'name',
    align: 'center',
    label: 'Name',
    filterable: true,
    field: 'name',
    sortable: true
  },
  {
    name: 'description',
    align: 'center',
    label: 'Description',
    filterable: true,
    field: 'description',
    sortable: true
  },
  {
    label: 'Active',
    name: 'active',
    filterable: true,
    style: 'width:60px',
    filterConfig: { type: 'toggle' },
    align: 'center',
    field: 'active',
  },
  {
    name: 'users',
    align: 'center',
    label: 'Users',
    filterable: true,
    field: row => row.users?.length,
    sortable: true
  },
];

watch( () => selected.value, ( val )=>{ if( val.length>0 ){ profile.value = JSON.parse( JSON.stringify( val[0] ) ); } } );

</script>

<style scoped lang="scss">
.permission-table {
  border-collapse: collapse;
  border: 1px solid #d1d1d1;

  td{
    padding: 5px;
    border: 1px solid #d1d1d1;

  }

  .even-permission-cells {
    background-color: #dddddd;
  }

  .odd-permission-cells {

  }

  .td-no-top-border{
    border-top: 0;
  }
  .td-no-bottom-border{
    border-bottom: 0;
  }

}

</style>
