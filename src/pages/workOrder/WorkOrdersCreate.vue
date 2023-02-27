<template>
  <DefaultCreate
    title="Work Order"
    class="col"
    @submit.prevent="create()"
  >
    <CreateSection
      title="Contact Info"
    >
      <MagicSelect
        v-model="workOrder.patient"
        :filter-options="[ { label: 'Full Name', value: 'person.fullname' } ]"
        model="patients"
        add-button-label="Select patient"
        label="Patient"
        required
        editable
        :search-visualization-text="( el )=>`${el.id}-${get( el, 'person.fullname', 'No Name' )}`"
        :label-field="( el )=>`${el.id}-${get( el, 'person.fullname', 'No Name' )}`"
      />
      <TextInput
        v-model="workOrder.contactPhone"
        :label="t( 'people.create.contactPhone' )"
        required
      />
    </CreateSection>
    <CreateSection
      title="Order Info"
    >
      <TextInput
        v-model="workOrder.proof"
        label="Proof"
        required
      />
      <TextInput
        v-model="workOrder.instructions"
        type="textarea"
        label="Instructions"
        required
      />
      <DefaultToggle
        v-model="workOrder.antagonist"
        label="Antagonist"
      />
      <DefaultToggle
        v-model="workOrder.occlusalRelationship"
        label="Oclusal Relationship"
      />
      <DefaultToggle
        v-model="workOrder.impressionHolder"
        label="Impression Holder"
      />
    </CreateSection>
    <CreateSection title="3D File">
      <FileInput
        v-model="workOrder.files.file"
        accept=".stl"
        label="3d File"
      />
    </CreateSection>
    <div class="image-container">
      <ModelStl
        v-if="workOrder.files.file"
        ref="model3d"
        :src="createObjectURL( workOrder.files.file )"
      />
      <DefaultButton
        button-style="primary"
        label="Mesh"
        @click="enableMeshView()"
      />
    </div>
  </DefaultCreate>
</template>

<script setup>
import DefaultCreate from 'components/general/forms/DefaultCreate.vue';
import TextInput from 'components/general/inputs/TextInput.vue';
import { ApiConnector } from '@/apiConnector.js';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { useI18n } from "vue-i18n";
import CreateSection from "components/general/forms/create/CreateSection.vue";
import { ModelStl } from 'vue-3d-model';
import FileInput from "components/general/inputs/FileInput.vue";
import { get } from 'lodash';
import MagicSelect from "components/general/inputs/MagicSelect.vue";
import DefaultToggle from "components/general/inputs/DefaultToggle.vue";
import { MeshDepthMaterial } from 'three';
import DefaultButton from "components/general/DefaultButton.vue";


const { t }= useI18n( { useScope: 'global' } );
const model3d = ref();

const router = useRouter();
let workOrdersConnector = new ApiConnector( 'workOrders' );
let workOrder = ref( { files: {} } );

function enableMeshView(){
  let [ object3d ] = model3d.value.scene.children[0].children;
  console.log( object3d );
  object3d.material = new MeshDepthMaterial( { wireframe: true, opacity: .7 } );
}

function create(){
  workOrdersConnector.create( { data: workOrder.value, postCreateHandler: ()=> router.push( { name: 'orders.list' } ) } );
}

function createObjectURL( object ) {
  return ( window.URL ) ? window.URL.createObjectURL( object ) : window.webkitURL.createObjectURL( object );
}

</script>

<style scoped>
.image-container{
  border-radius: 41px;
  overflow: hidden;
}
</style>
