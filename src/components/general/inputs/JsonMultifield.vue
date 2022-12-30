<template>
  <div class="json-multifield">
    <div>
      <div
        class="row justify-between full-width"
      >
        <p
          v-if="title"
          class="text-subtitle1"
        >
          {{ title }}
        </p>
        <DefaultButton
          v-if="editable"
          margin="q-ma-none"
          round
          size="sm"
          icon="mdi-plus"
          button-style="primary"
          @click="updateModelValue( [ ...modelValue, {} ] )"
        />
      </div>
    </div>
    <div
      v-for="( el, idx ) of modelValue"
      :key="idx"
      class="row wrap items-center justify-between"
    >
      <div class="col">
        <div class="row q-mb-sm">
          <template
            v-for="( field, idz ) of fields"
            :key="idz"
          >
            <EditableContainer
              v-if="field.renderCondition ? field.renderCondition( el ) : true"
              :editable="editable"
              :loading="loading"
              width="auto"
              :row="false"
              :class="`col-${field.cols ?? 6}`"
            >
              <template #default="props">
                <slot
                  :name="field-[ field.name ]"
                  v-bind="props"
                >
                  <EditableFile
                    v-if="field.type === 'file'"
                    v-model="el[field.name]"
                    hide-bottom-space
                    :label="field.label"
                    v-bind="props"
                  />
                  <EditableNumber
                    v-else-if="field.type === 'number'"
                    v-model="el[field.name]"
                    hide-bottom-space
                    :prefix="field.prefix"
                    :label="field.label"
                    v-bind="props"
                  />
                  <EditablePassword
                    v-else-if="field.type === 'password'"
                    v-model="el[field.name]"
                    hide-bottom-space
                    :label="field.label"
                    v-bind="props"
                  />
                  <EditableSelect
                    v-else-if="field.type === 'select'"
                    v-model="el[field.name]"
                    hide-bottom-space
                    :label="field.label"
                    :options="field.options"
                    v-bind="props"
                  />
                  <EditableToggle
                    v-else-if="field.type === 'toggle'"
                    v-model="el[field.name]"
                    hide-bottom-space
                    :positive-color="field.positiveColor"
                    :negative-color="field.negativeColor"
                    :label="field.label"
                    v-bind="props"
                  />
                  <EditableDate
                    v-else-if="field.type === 'date'"
                    v-model="el[field.name]"
                    hide-bottom-space
                    :positive-color="field.positiveColor"
                    :negative-color="field.negativeColor"
                    :label="field.label"
                    v-bind="props"
                  />
                  <EditableCurrency
                    v-else-if="field.type === 'currency'"
                    v-model="el[field.name]"
                    hide-bottom-space
                    :label="field.label"
                    v-bind="props"
                  />
                  <EditableText
                    v-else
                    v-model="el[field.name]"
                    hide-bottom-space
                    :label="field.label"
                    v-bind="props"
                  />
                </slot>
              </template>
            </EditableContainer>
          </template>
        </div>
      </div>
      <div class="col-auto">
        <DefaultButton
          v-if="editable"
          button-style="secondary"
          margin="q-ml-sm"
          round
          size="sm"
          color="negative"
          icon="mdi-delete"
          @click="updateModelValue( [ ...modelValue ].filter( ( el, idy ) => idy !== idx ) )"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import DefaultButton from 'components/general/DefaultButton.vue';
import EditableText from 'components/general/inputs/editableItems/EditableText.vue';
import EditableFile from 'components/general/inputs/editableItems/EditableFile.vue';
import EditableNumber from 'components/general/inputs/editableItems/EditableNumber.vue';
import EditablePassword from 'components/general/inputs/editableItems/EditablePassword.vue';
import EditableSelect from 'components/general/inputs/editableItems/EditableSelect.vue';
import EditableToggle from 'components/general/inputs/editableItems/EditableToggle.vue';
import EditableContainer from 'components/general/EditableContainer.vue';
import EditableDate from 'components/general/inputs/editableItems/EditableDate.vue';
import EditableCurrency from 'components/general/inputs/editableItems/EditableCurrency.vue';

defineProps( {
  width: { type: [ Number, String ], default: '260px' },
  fields: { type: Array, default: ()=>[] },
  editable: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  modelValue: { type: Array, default: ()=>[] },
  title: { type: String, default: '' }
} );

function updateModelValue( newModelValue ){
  emit( 'update:modelValue', newModelValue );
}

let emit = defineEmits( [ 'update:modelValue' ] );

</script>

<style scoped>
.json-multifield{
  max-width: 100%!important;
  width: v-bind( width );
}
</style>
