<template>
  <RelationTableToolbar
    v-if="toolbar"
    v-model:search="search"
    :displayed-data="displayedData"
    :selected-data="selected"
    :export-columns="cols"
    :add-button-handler="deletionMode === 'local' ? addRecord : creationFunction"
    :add-button-tooltip="addButtonTooltip"
    :delete-button-handler="deletionMode === 'local' ? deleteElements : deleteFunction"
    :delete-button-tooltip="deleteButtonTooltip"
  />
  <q-table
    ref="table"
    :selected="selected"
    :columns="cols"
    :rows="modelValue"
    :dense="editable"
    :filter="search"
    selection="multiple"
    :class="`relation-table ${!$q.platform.is.desktop?'relation-table-mobile':''}`"
    row-key="id"
    @row-click="( evt, row )=>rowClickFunction( row )"
    @update:selected="( val )=>updateSelected( val )"
  >
    <!-- Header -->
    <template
      v-if="$slots.top"
      #top
    >
      <slot name="top" />
    </template>
    <!-- Table Body -->
    <template
      v-for="( column, idx ) of cols"
      :key="idx"
      #[`body-cell-${column.name}`]="props"
    >
      <q-td
        v-if="!editable"
        :props="props"
        class="relation-table-description-field"
      >
        <div v-if="column.editionField?.type === ( 'singleActivatable' || 'multipleActivatable' || 'toggle' )">
          <q-icon
            :color="props.row[column.name] ? 'positive':'negative'"
            size="md"
            :name="props.row[column.name] ? 'mdi-check':'mdi-close'"
          />
        </div>
        <div v-if="( column.type === 'icon' )">
          <q-icon
            size="sm"
            :style="`color:${props.row[column.name].color}`"
            :name="props.row[column.name].icon"
          />
        </div>
        <div v-if="( column.type === 'icons' )">
          <q-icon
            v-for="( type, idx ) of props.row[column.name]"
            :key="idx"
            size="sm"
            :style="`color:${type.color}`"
            :name="type.icon"
          />
        </div>
        <template
          v-else
        >
          {{ _.isFunction( column.field ) ? column.field( props.row ) : props.row[column.field] }}
        </template>
      </q-td>
      <q-td
        v-else
        :props="props"
      >
        <p
          v-if="( props.row.id !== editMode || !column.editionField ) && ![ 'singleActivatable', 'multipleActivatable' ].includes( column.editionField?.type )"
          class="relation-table-description-field"
        >
          {{ _.isFunction( column.field ) ? column.field( props.row ) : props.row[column.field] }}
        </p>
        <div v-else-if="column.editionField.type === 'multipleActivatable'">
          <DefaultButton
            v-if="!props.row[column.name]"
            :icon="column.editionField.toggleable ? column.editionField.negativeIcon || 'mdi-close': null"
            :color="column.editionField.negativeColor || 'negative'"
            margin="q-mx-sm"
            button-style="secondary"
            round
            outline
            size="md"
            height="auto"
            @click="props.row[column.name] = !props.row[column.name]"
          />
          <DefaultButton
            v-else-if="props.row[column.name] && column.editionField.toggleable"
            margin="q-mx-sm"
            button-style="secondary"
            round
            :color="column.editionField.positiveColor || 'positive'"
            :icon="column.editionField.toggleable ? column.editionField.positiveIcon || 'mdi-check': null"
            size="md"
            height="auto"
            outline
            @click="props.row[column.name] = !props.row[column.name]"
          />
          <q-icon
            v-else
            size="sm"
            color="positive"
            name="mdi-check"
          />
        </div>
        <div v-else-if="column.editionField.type === 'singleActivatable'">
          <DefaultButton
            v-if="!props.row[column.name] && ( column.editionField.activatableOnEdit ? props.row.id === editMode : props.row.id !== editMode )"
            margin="q-mx-sm"
            button-style="secondary"
            round
            size="sm"
            height="auto"
            outline
            @click="props.row[column.name] = !props.row[column.name]"
          />
          <div v-else-if="props.row[column.name]">
            <q-icon
              size="sm"
              color="positive"
              name="mdi-check"
            />
          </div>
        </div>
        <div v-else>
          <TextInput
            v-if="( column.editionField.type === 'text' ) || !column.editionField.type"
            :ref="refs[column.name]"
            v-model="props.row[column.name]"
            :rules="column.editionField.rules"
            lazy-rules
            width="100%"
            hide-bottom-space
          />
          <CurrencyInput
            v-if="( column.editionField.type === 'currency' )"
            :ref="refs[column.name]"
            v-model="props.row[column.name]"
            :rules="column.editionField.rules"
            lazy-rules
            width="100%"
            hide-bottom-space
          />
          <NumberInput
            v-if="( column.editionField.type === 'number' )"
            :ref="refs[column.name]"
            v-model="props.row[column.name]"
            :rules="column.editionField.rules"
            lazy-rules
            width="100%"
            hide-bottom-space
          />
          <PasswordInput
            v-if="( column.editionField.type === 'password' )"
            :ref="refs[column.name]"
            v-model="props.row[column.name]"
            :rules="column.editionField.rules"
            lazy-rules
            width="100%"
            hide-bottom-space
          />
          <DefaultDate
            v-if="( column.editionField.type === 'date' )"
            :ref="refs[column.name]"
            v-model="props.row[column.name]"
            :rules="column.editionField.rules"
            lazy-rules
            width="100%"
            hide-bottom-space
          />
          <DefaultSelect
            v-if="( column.editionField.type === 'select' )"
            :ref="refs[column.name]"
            v-model="props.row[column.name]"
            :options="column.editionField.options"
            :rules="column.editionField.rules"
            lazy-rules
            width="100%"
            hide-bottom-space
          />
          <DefaultToggle
            v-if="( column.editionField.type === 'toggle' )"
            :ref="refs[column.name]"
            v-model="props.row[column.name]"
            :rules="column.editionField.rules"
            lazy-rules
            width="100%"
            hide-bottom-space
          />
        </div>
      </q-td>
    </template>
    <template
      v-if="editable"
      #body-cell-actions="data"
    >
      <slot
        name="body-cell-actions"
        :props="data"
      >
        <q-td
          class="justify-end"
          :props="data"
        >
          <DefaultButton
            v-if="( editionMode === 'local' || editionFunction ) && data.row.id !== editMode"
            margin="q-mx-sm"
            button-style="secondary"
            round
            size="sm"
            height="auto"
            icon="mdi-pencil"
            @click="( evt )=> evt.stopImmediatePropagation( editMode = data.row.id )"
          >
            <DefaultTooltip>Edit</DefaultTooltip>
          </DefaultButton>
          <DefaultButton
            v-else-if="editionMode === 'local' || editionFunction"
            margin="q-mx-sm"
            button-style="secondary"
            round
            size="sm"
            height="auto"
            icon="mdi-check"
            color="positive"
            @click="( evt )=> evt.stopImmediatePropagation( editionMode === 'local' ? saveRecord() : editionFunction( data.row ) )"
          >
            <DefaultTooltip>Save</DefaultTooltip>
          </DefaultButton>
          <DefaultButton
            v-if="deletionMode === 'local' || deleteFunction"
            margin="q-mx-sm"
            button-style="secondary"
            round
            size="sm"
            height="auto"
            color="negative"
            icon="mdi-delete"
            @click="( evt )=> evt.stopImmediatePropagation( deletionMode === 'local' ? deleteElements( data.row ) : deleteFunction( data.row ) )"
          >
            <DefaultTooltip>
              Delete
            </DefaultTooltip>
          </DefaultButton>
        </q-td>
      </slot>
    </template>
  </q-table>
</template>

<script setup>
import DefaultButton from 'components/general/DefaultButton.vue';
import DefaultTooltip from 'components/general/DefaultTooltip.vue';
import { computed, ref, watch } from 'vue';
import TextInput from 'components/general/inputs/TextInput.vue';
import _ from 'lodash';
import NumberInput from 'components/general/inputs/NumberInput.vue';
import PasswordInput from 'components/general/inputs/PasswordInput.vue';
import DefaultDate from 'components/general/inputs/DefaultDate.vue';
import DefaultSelect from 'components/general/inputs/DefaultSelect.vue';
import DefaultToggle from 'components/general/inputs/DefaultToggle.vue';
import RelationTableToolbar from 'components/general/lists/RelationTableToolbar.vue';
import CurrencyInput from 'components/general/inputs/CurrencyInput.vue';

let props = defineProps( {
  // Behavior
  // Behavior -> Deletion
  deletionMode: { type: String, default: 'custom', validate: ( prop )=>[ 'local', 'custom' ].includes( prop ), required: false },
  deleteFunction: { type: [ Function, null ], default: null, required: false },
  // Behavior -> Creation
  creationMode: { type: String, default: 'custom', validate: ( prop )=>[ 'local', 'custom' ].includes( prop ), required: false },
  creationFunction: { type: [ Function, null ], default: null, required: false },
  // Behavior -> Edition
  editionMode: { type: String, default: 'custom', validate: ( prop )=>[ 'local', 'custom' ].includes( prop ), required: false },
  editionFunction: { type: [ Function, null ], default: null, required: false },
  editable: { type: Boolean, default: false },
  // Behavior -> Click
  rowClickFunction: { type: Function, default: ()=>{} },
  // Toolbar
  toolbar: { type: Boolean, default: true, required: false },
  addButtonTooltip: { type: String, default: undefined, required: false },
  deleteButtonTooltip: { type: String, default: undefined, required: false },
  exportConfig: { type: Object, default: ()=>{ return { enabled: true }; }, required: false },
  // Content
  title: { type: String, default: '' },
  cols: { type: Array, default: ()=>[] },
  modelValue: { type: Array, default: ()=>[] },
  selected: { type: Array, default: ()=>[] },
} );


let editMode = ref( null );
let hasErrorValue = ref( false );
let displayedData = computed( ()=> table.value ? table.value.computedRows : [] );
let refs = ref( {} );
let table = ref( null );

const emit = defineEmits( [ 'update:modelValue', 'update:selected' ] );

// Search
let search = ref( '' );


// Actions

function addRecord(){
  if ( editMode.value ) {
    validate();
    if ( !hasError() ) {
      let newId = props.modelValue[props.modelValue.length-1].id+1;
      editMode.value = newId;
      emit( 'update:modelValue', [ ...props.modelValue, { id: newId } ] );
    }
  } else {
    let newId;
    if ( !props.modelValue.length ){
      newId = 1;
    } else {
      newId = props.modelValue[props.modelValue.length - 1].id + 1 ?? 1;
    }
    emit( 'update:modelValue', [ ...props.modelValue, { id: newId } ] );
    editMode.value = newId;
  }
}

function deleteElements( data ){
  if ( !_.isArray( data ) ) {
    emit( 'update:modelValue', props.modelValue.filter( ( el ) => el.id !== data.id ) );
    editMode.value = null;
  } else {
    const selectedIds = data.map( ( el ) => el.id );
    emit( 'update:modelValue', props.modelValue.filter( ( el ) => !selectedIds.includes( el.id ) ) );
    updateSelected( [] );
  }
}

function updateSelected( val ){
  emit( 'update:selected', val );
}

function saveRecord(){
  validate();
  if ( !hasError() ) {
    editMode.value = null;
  }
}

if ( _.isEmpty( props.modelValue ) && props.editable ){
  addRecord();
}

//Helper Functions

function validate(){
  let errors=[];
  for ( let key of Object.keys( refs.value ) ){
    refs[key].validate();
    refs[key].hasError() ?? errors.push( refs[key].hasError() ); //todo fix
  }
  hasErrorValue.value = errors.length>0;
}

function hasError(){
  return hasErrorValue.value;
}

//Vue

watch( ()=>props.editable, async( val )=>{
  if ( !val ) {
    editMode.value = null;
  }else if( props.creationMode !== 'local' ){
    editMode.value = null;
  }else {
    if ( _.isEmpty( props.modelValue ) ){
      addRecord();
    }
  }
} );

defineExpose( { validate, hasError } );

</script>

<style scoped lang="scss">
.table-textarea{
  font-size:13px!important;
}

.relation-table-description-field{
  max-width: 200px;
  overflow-wrap: break-word;
  margin: 0;
  white-space: pre-wrap;
}

.relation-table{
  :deep(.q-field){
    min-width: auto;
  }
}

</style>

<style lang="scss">
.relation-table-number {
  input::-webkit-outer-spin-button, input::-webkit-inner-spin-button {
    /* display: none; <- Crashes Chrome on hover */
    -webkit-appearance: none!important;
    margin: 0!important; /* <-- Apparently some margin are still there even though it's hidden */
  }

  :deep(input[type=number]) {
    -moz-appearance: textfield!important; /* Firefox */
  }
}

.relation-table-mobile{
  max-width: 100%;
}

</style>
