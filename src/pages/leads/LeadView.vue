<template>
  <DefaultEdit
    v-model:editable="editMode"
    :loading="loading"
    :title="t( 'lead.view.title', { id: id } )"
    :cancel-edition="cancelEdition"
    :update-function="update"
    :delete-function="deleteRecord"
  >
    <template #default="props">
      <div class="flex">
        <ColumnContainer
          :column-title="t( 'lead.view.titleInfo' )"
          elevation="4"
        >
          <ColumnSection>
            <EditableSelect
              v-model="lead.type"
              v-bind="props"
              :options="[ { label: t( 'lead.view.options.legalEntity' ), value: 'legalEntity' }, { label: t( 'lead.view.options.individual' ), value: 'individual' } ]"
              :label="t( 'lead.view.type' )"
            />
            <EditableText
              v-if="lead.type==='legalEntity'"
              v-model="lead.data.legalName"
              v-bind="props"
              :label="t( 'lead.view.legalName' )"
              required
            />
            <EditableText
              v-model="lead.data.firstName"
              v-bind="props"
              :label="t( 'lead.view.firstName' )"
            />
            <EditableText
              v-model="lead.data.lastName"
              v-bind="props"
              :label="t( 'lead.view.lastName' )"
            />
            <EditableText
              v-model="lead.data.streetAddress"
              v-bind="props"
              :label="t( 'lead.view.streetAddress' )"
            />
            <EditableText
              v-model="lead.data.settlement"
              v-bind="props"
              :label="t( 'lead.view.settlement' )"
            />
            <EditableText
              v-model="lead.data.city"
              v-bind="props"
              :label="t( 'lead.view.city' )"
            />
            <EditableText
              v-model="lead.data.state"
              v-bind="props"
              :label="t( 'lead.view.state' )"
            />
            <EditableText
              v-model="lead.data.zipcode"
              v-bind="props"
              :label="t( 'lead.view.zipcode' )"
            />
            <EditableText
              v-model="lead.data.country"
              v-bind="props"
              :label="t( 'lead.view.country' )"
            />
            <EditableText
              v-model="lead.data.references"
              v-bind="props"
              :label="t( 'lead.view.references' )"
            />
          </ColumnSection>
        </ColumnContainer>
        <ColumnContainer
          column-title="Information about the tracing"
          class="relatedData col-12 col-lg-6"
        >
          <RelationTable
            v-model="lead.leadUpdates"
            v-model:selected="selectedLeadUpdates"
            add-button-tooltip="Create new Comments"
            :editable="editMode"
            :delete-function="deleteHoa"
            :edition-function="updateHoa"
            :creation-function="()=>leadUpdatesDialog = true"
            :cols="leadUpdatesCols()"
          />
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
  <q-dialog
    v-model="leadUpdatesDialog"
    class="q-pa-md q-gutter-sm"
  >
    <q-card class="q-pa-lg">
      <q-form
        @submit.prevent="createLeadUpdates()"
      >
        <span class="text-h4">Comments</span>
        <DefaultSelect
          v-model="leadUpdate.status"
          label="Status"
          :options="[ { label: 'Created', value: 'created' }, { label: 'Call', value: 'call' }, { label: 'Visit', value: 'visit' } ]"
        />
        <TextInput
          v-model="leadUpdate.comments"
          label="Comments"
        />
        <div
          class="row"
        >
          <DefaultButton
            button-style="primary"
            @click="leadUpdatesDialog = !leadUpdatesDialog"
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

import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue';
import ActionConfirmation from 'components/general/ActionConfirmation.vue';
import { ApiConnector } from '@/apiConnector.js';
import EditableText from 'components/general/inputs/editableItems/EditableText.vue';
import DefaultEdit from 'components/general/forms/DefaultEdit.vue';
import EditableSelect from "components/general/inputs/editableItems/EditableSelect.vue";
import { useI18n } from "vue-i18n";
import ColumnContainer from "components/general/containers/columnContainer/ColumnContainer.vue";
import ColumnSection from "components/general/containers/columnContainer/ColumnSection.vue";
import DefaultSelect from "components/general/inputs/DefaultSelect.vue";
import DefaultButton from "components/general/DefaultButton.vue";
import RelationTable from "components/general/lists/RelationTable.vue";
import TextInput from "components/general/inputs/TextInput.vue";
import { formatDateInput } from '@/helpers.js';

const { t }= useI18n( { useScope: 'global' } );

const router = useRouter();
const leadConnector = new ApiConnector( 'leads' );
const leadUpdatesConnector = new ApiConnector( 'leadUpdates' );
let editMode = ref( false );
let confirmDialog = ref( false );
let loading = ref( false );
let selectedLeadUpdates = ref( [] );
let leadUpdatesDialog = ref( false );
let leadUpdate = ref( {} );

//Delete Record
async function deleteRecord(){
  await leadConnector.delete( { id: id.value } );
  confirmDialog.value = false;
  router.push( { name: 'leads.list' } );
}

//Get Route Params
const route = useRoute();
let id = ref( route.params.id );

//Get Lead Data
let lead = ref( { data: {} } );

const findLeadErrorActions = [
  {
    label: "Try again",
    class: 'q-mx-xs',
    color: 'white',
    rounded: true,
    outline: true,
    handler: ()=>findLead(),
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

async function findLead(){
  loading.value = true;
  lead.value = await leadConnector.findOne( { id: id.value, errorActions: findLeadErrorActions } );
  loading.value = false;
}
findLead();

//Update Lead Data

async function cancelEdition(){
  await findLead();
  editMode.value = false;
}

const UpdateLeadErrorActions = [
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
      findLead();
    },
  }
];

async function update(){
  await leadConnector.update( {
    data: lead.value,
    postUpdateHandler: ()=>{ editMode.value = false; findLead(); },
    actions: UpdateLeadErrorActions,
  } );
}

async function createLeadUpdates(){
  leadUpdate.value = { ...leadUpdate.value, lead: id };
  await leadUpdatesConnector.create( {
    data: leadUpdate.value,
    postCreateHandler: ()=>{
      leadUpdatesDialog.value = false;
      leadUpdate.value = {};
      findLead();
    }
  } );
}

let leadUpdatesCols = () => [
  {
    name: 'id',
    label: 'Id',
    align: 'left',
    field: row => row.id,
    sortable: true
  },
  {
    name: 'createdAt',
    label: 'Created',
    align: 'center',
    field: ( row )=> formatDateInput( row.createdAt, 'DD/MM/YYYY' ),
  },
  {
    name: 'status',
    label: 'Status',
    align: 'center',
    editionField: { type: 'select', options: [ { label: 'Created', value: 'created' }, { label: 'Call', value: 'call' }, { label: 'Visit', value: 'visti' } ] },
    field: row => row.status,
    sortable: true
  },
  {
    name: 'comments',
    label: 'Comments',
    align: 'center',
    field: row => row.comments,
    sortable: true
  },
  editMode.value ?
    {
      name: 'actions',
      label: 'Actions',
      align: 'center',
    } : '',
];

</script>

<style scoped>

</style>
