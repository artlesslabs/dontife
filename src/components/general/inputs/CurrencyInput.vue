<template>
  <DefaultInput
    ref="defaultInput"
    :required="required"
    mask="###,###,###,###,###.##"
    reverse-fill-mask
    :rules="rules"
    :label="label"
    :dense="dense"
    :v-model="currencyModel"
    prefix="$"
    @update:model-value="( val )=>{ formattedValue = val }"
  />
</template>

<script setup>
import DefaultInput from 'components/general/inputs/DefaultInput.vue';
import { computed, ref } from 'vue';


const defaultInput = ref( null );

let formattedValue = computed( {
 get: ()=>{
   return props.modelValue;
 },
 async set( val ){
   val= val.replaceAll( ',', '' );
   emit( 'update:modelValue', val );
}
} );
let currencyModel = ref( 0 );

function validate(){
  defaultInput.value.validate();
}

function hasError(){
  return defaultInput.value.hasError();
}

defineExpose( { validate, hasError } );
let emit = defineEmits( [ 'update:modelValue' ] );

let props = defineProps( {
  required: { type: Boolean, default: false },
  label: { type: String, default: '' },
  dense: { type: Boolean, default: true },
  rules: { type: Array, default: ()=>[] },
  max: { type: [ Number, Boolean ], default: false },
  min: { type: [ Number ], default: 0 },
  prefix: { type: String, default: '' },
} );
</script>

<style scoped>

</style>
