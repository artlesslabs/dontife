<template>
  <q-form @submit.prevent="updateRecord()">
    <div class="view-bar-container shadow-3">
      <div class="q-px-md row items-center">
        <span class="text-h5"> {{ title }}</span>
        <q-space />
        <div
          v-if="!editable"
          class="row"
        >
          <DefaultButton
            button-style="primary"
            @click="toggleEditable()"
          >
            Edit
          </DefaultButton>
          <DefaultButton
            v-if="deleteFunction"
            button-style="delete"
            @click="confirmDialog = !confirmDialog"
          >
            Delete
          </DefaultButton>
        </div>
        <div
          v-else
          class="row"
        >
          <DefaultButton
            button-style="primary"
            @click="()=>{ cancelEdition(); toggleEditable(); }"
          >
            Cancel
          </DefaultButton>
          <DefaultButton
            button-style="primary"
            type="submit"
            :loading="updateLoading"
          >
            Save
          </DefaultButton>
        </div>
      </div>
    </div>
    <q-card-section class="q-mb-md q-pa-md">
      <div>
        <slot
          :editable="editable"
          :loading="loading"
        />
      </div>
    </q-card-section>
  </q-form>
  <ActionConfirmation
    v-model="confirmDialog"
    message="Are you sure you want to delete current record."
    :confirm-handler="deleteElement"
    :cancel-handler="()=>{ confirmDialog = !confirmDialog }"
  />
</template>

<script setup>
import DefaultButton from 'components/general/DefaultButton.vue';
import { ref } from 'vue';
import ActionConfirmation from 'components/general/ActionConfirmation.vue';

let props = defineProps( {
  deleteFunction: { type: [ Function, null ], default: null, required: false },
  title: { type: String, default: '' },
  cancelEdition: { type: Function, default: ()=>{} },
  editable: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  updateFunction: { type: Function, default: ()=>{} }
} );

let emit = defineEmits( [ 'update:editable' ] );
let updateLoading = ref( false );

function toggleEditable(){
  emit( 'update:editable', !props.editable );
}

async function deleteElement(){
  await props.deleteFunction();
  confirmDialog.value = false;
}

async function updateRecord(){
  if ( !updateLoading.value ){
    updateLoading.value = true;
    try {
      await props.updateFunction();
    }
    catch ( e ) {
      console.log( e.message );
    }
    updateLoading.value = false;
  }
}

let confirmDialog = ref( false );
</script>

<style scoped>
.view-bar-container{
  background-color: rgba(255,255,255,0.7);
  border-radius: 15px;
}
</style>
