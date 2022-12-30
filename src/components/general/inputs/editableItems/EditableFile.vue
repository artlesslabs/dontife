<template>
  <div
    v-if="!hideOnEdit || !editable"
    class="col-auto editable-file-container"
  >
    <q-skeleton
      v-if="loading"
      width="100%"
      type="QInput"
      class="q-mb-md q-ml-sm"
    />
    <div
      v-else-if="editable"
    >
      <!--      todo configurar bottom-space -->
      <FileInput
        v-bind="props"
        hide-bottom-space
        :model-value="modelValue"
        @update:model-value="( evt ) => $emit( 'update:modelValue', evt )"
      />
      <div
        v-if="multiple && currentFiles?.length > 0"
      >
        <q-chip
          v-for="( el, idx ) of currentFiles"
          :key="idx"
          removable
          clickable
          @remove="removeFileFunction( idx )"
          @click="openFile( `${contentURL}${el.url}` )"
        >
          {{ el.name }}
        </q-chip>
      </div>
      <q-chip
        v-else-if="!multiple && !isEmpty( currentFiles )"
        removable
        clickable
        @remove="removeFileFunction"
        @click="openFile( `${contentURL}${currentFiles.url}`, '_blank' )"
      >
        {{ currentFiles.name }}
      </q-chip>
    </div>
    <VisualizationItem
      v-else
      v-bind="props"
      :label="label"
      :value="modelValue"
    >
      <template #value>
        <q-chip
          v-if="!currentFiles"
        >
          No file
        </q-chip>
        <div
          v-if="multiple"
          class="column"
        >
          <q-chip
            v-for="( el, idx ) of currentFiles"
            :key="idx"
            clickable
            @click="openFile( `${contentURL}${el.url}` )"
          >
            {{ el.name }}
          </q-chip>
        </div>
        <q-chip
          v-else
          clickable
          @click="openFile( `${contentURL}${currentFiles.url}`, '_blank' )"
        >
          {{ currentFiles.name }}
        </q-chip>
      </template>
    </VisualizationItem>
  </div>
</template>

<script setup>
import { isEmpty } from 'lodash';
import FileInput from 'components/general/inputs/FileInput.vue';
import VisualizationItem from 'components/general/VisualizationItem.vue';
import { contentURL } from '@/constants.js';

let props = defineProps( {
  width: { type: String, default: 'auto' },
  currentFiles: { type: [ Object, Array, Boolean ], default: false },
  loading: { type: Boolean, default: false },
  multiple: { type: Boolean, default: false },
  labelColor: { type: String, default: '$primary' },
  removeFileFunction: { type: [ Function, Boolean ], default: false, required: false },
  fileColor: { type: String, default: '' },
  row: { type: Boolean, default: true },
  label: { type: String, default: '' },
  editable: { type: Boolean, default: false },
  modelValue: { type: String, default: '' },
  hideOnEdit: { type: Boolean, default: false }
} );

defineEmits( [ 'update:modelValue' ] );

function openFile( url ){
  { window.open( url, '_blank' ); }
}

</script>

<style lang="scss" scoped>
.editable-file-container{
  width: v-bind( 'width' );
}

</style>
