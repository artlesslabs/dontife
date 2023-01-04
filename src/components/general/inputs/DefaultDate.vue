<template>
  <!--  Individual -->
  <DefaultInput
    v-if="!multiple"
    ref="defaultInput"
    v-model="formattedModelDate"
    :mask="mask"
    :rules="[ ( required ? rRequired: '' ), ( format === 'DD/MM/YYYY' ? isDateDDMMYYYY : isDate ), ...rules ]"
    v-bind="$attrs"
  >
    <template #append>
      <q-icon
        name="event"
        class="cursor-pointer"
      >
        <q-popup-proxy
          cover
          transition-show="scale"
          transition-hide="scale"
        >
          <q-date
            v-model="formattedModelDate"
            :mask="format"
            :default-year-month="getDefaultYM()"
            no-unset
            v-bind="$attrs"
            required
          >
            <div class="row items-center justify-end">
              <q-btn
                v-close-popup
                label="Close"
                color="primary"
                flat
              />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </DefaultInput>

  <!--  Multiple -->
  <DefaultSelect
    v-else
    v-model="formattedModelDate"
    multiple
    hide-dropdown-icon
    required="required"
    mask="date"
  >
    <template #append>
      <q-icon
        name="event"
        class="cursor-pointer"
      >
        <q-popup-proxy
          cover
          transition-show="scale"
          transition-hide="scale"
        >
          <q-date
            v-model="formattedModelDate"
            no-unset
            :mask="format"
            multiple
          >
            <div class="row items-center justify-end">
              <q-btn
                v-close-popup
                label="Close"
                color="primary"
                flat
              />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </DefaultSelect>
</template>

<script setup>
import { rRequired } from '@/validationRules';
import DefaultInput from 'components/general/inputs/DefaultInput.vue';
import DefaultSelect from 'components/general/inputs/DefaultSelect.vue';
import { computed, onMounted, } from 'vue';
import { date } from 'quasar';
import { isDate, isDateDDMMYYYY } from '@/validationRules.js';
import { formatDateInput } from '@/helpers.js';


// Vue
let emit = defineEmits( [ 'update:modelValue' ] );

let props = defineProps( {
  defaultToday: { type: Boolean, default: true, required: false },
  format: { type: String, default: 'MM/DD/YYYY', required: false }, // Add to project config file
  mask: { type: String, default: '##/##/####', required: false }, // Add to project config file
  multiple: { type: Boolean, default: false },
  modelValue: { type: [ String, Array, null ], default: null },
  rules: { type: Array, default: ()=>[] },
  required: { type: Boolean, default: false },
} );

// Lifecycle

onMounted( ()=>{
  if ( props.defaultToday && ! props.modelValue ){
    formattedModelDate.value = date.formatDate( new Date().toISOString(), props.format );
  }
} );

// modelValue

let formattedModelDate = computed( {
  get: () => {
    if ( props.multiple ){
      return props.modelValue.map( ( el )=>formatDateInput( el, props.format ) );
    } else {
      if ( props.modelValue?.length < 10 ) {
        return props.modelValue;
      } else if ( !formatDateInput( props.modelValue, props.format ) ) {
        return props.modelValue;
      } else {
        return formatDateInput( props.modelValue, props.format );
      }
    }
  },
  async set( newVal ) {
    if ( props.multiple ){
      await emit( 'update:modelValue', newVal.map( ( el )=>date.formatDate( el, 'YYYY-MM-DD' ) ) );
    } else {
      if ( newVal.length < 10 ) {
        await emit( 'update:modelValue', newVal );
      } else if ( !date.formatDate( newVal, 'YYYY-MM-DD' ) ) {
        await emit( 'update:modelValue', newVal );
      } else {
        await emit( 'update:modelValue', date.formatDate( newVal, 'YYYY-MM-DD' ) );
      }
    }
  }
} );

//Helpers

function getDefaultYM(){
  let today = new Date();
  return `${today.getFullYear()}/${today.getMonth()+1}`;
}

</script>

<style scoped>

</style>
