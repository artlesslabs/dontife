<template>
  <q-dialog
    class="q-pa-md q-gutter-sm"
    :model-value="active"
    @update:model-value="( val )=>$emit( 'update:active', val )"
  >
    <q-card class="q-pa-lg">
      <q-form
        ref="creationForm"
        @submit.prevent="creationFunction()"
      >
        <span class="text-h4">{{ title }}</span>
        <div
          v-for="( field, idx ) of fields"
          :key="idx"
        >
          <TextInput
            v-if="field.type === 'text'"
            :model-value="formData[field.value]"
            :label="field.label"
            :required="field.required"
          />
          <NumberInput
            v-if="field.type === 'number'"
            v-model="formData[field.value]"
            :label="field.label"
          />
          <DefaultDate
            v-if="field.type === 'date'"
            v-model="formData[field.value]"
            :label="field.label"
          />
          <DefaultToggle
            v-if="field.type === 'toggle'"
            v-model="formData[field.value]"
            :label="field.label"
          />
          <FileInput
            v-if="field.type === 'file'"
            v-model="formData[field.value]"
            :label="field.label"
            :multiple="field.multiple"
          />
          <PasswordInput
            v-if="field.type === 'pass'"
            v-model="formData[field.value]"
            :label="field.label"
          />
        </div>
        <div
          class="row"
        >
          <DefaultButton
            button-style="primary"
            @click="cancelButton"
          >
            Cancel
          </DefaultButton>
          <DefaultButton
            button-style="primary"
            type="submit"
            @click="saveButtonClick"
          >
            Save
          </DefaultButton>
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import TextInput from 'components/general/inputs/TextInput.vue';
import NumberInput from 'components/general/inputs/NumberInput.vue';
import DefaultDate from 'components/general/inputs/DefaultDate.vue';
import DefaultToggle from 'components/general/inputs/DefaultToggle.vue';
import FileInput from 'components/general/inputs/FileInput.vue';
import PasswordInput from 'components/general/inputs/PasswordInput.vue';
import DefaultButton from 'components/general/DefaultButton.vue';
import { computed } from 'vue';

let props = defineProps( {
  modelValue: { type: Object, default: ()=>{} },
  title: { type: String, default: '' },
  fields: { type: Array, default: ()=>[] },
  creationFunction: { type: Function, default: ()=>{} },
  active: { type: Boolean, default: false },
  closeOnSave: { type: Boolean, default: true }
} );

const formData = computed( {
  get: () => props.modelValue,
  set: ( data ) => emit( 'update:modelValue', data )
} );


let emit = defineEmits( [ 'update:active', 'update:modelValue', 'save' ] );

function cancelButton(){
  emit( 'update:active', !props.active );
  emit( 'update:modelValue', {} );
}

function saveButtonClick(){
  emit( 'save', props.modelValue );
  if ( props.closeOnSave ) {
    emit( 'update:active', false );
    emit( 'update:modelValue', {} );
  }
}

</script>

<style scoped>

</style>
