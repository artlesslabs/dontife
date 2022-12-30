<template>
  <span class="text-capitalize">{{ title }}</span>
  <DefaultButton
    v-if="positiveCondition( modelValue )"
    flat
    margin="0"
    dense
    color="positive"
    icon="mdi-check-circle"
    @click.stop.prevent="$emit( 'update:modelValue', isFunction( valueOnPositiveClick ) ? valueOnPositiveClick( modelValue ) : valueOnPositiveClick )"
  />
  <DefaultButton
    v-else
    flat
    margin="0"
    dense
    color="negative"
    icon="mdi-cancel"
    @click.stop.prevent="$emit( 'update:modelValue', isFunction( valueOnNegativeClick ) ? valueOnNegativeClick( modelValue ) : valueOnNegativeClick )"
  />
</template>

<script setup>
import DefaultButton from 'components/general/DefaultButton.vue';
import { isFunction } from 'lodash';

defineProps( {
  title: { type: String, required: true },
  modelValue: { type: null, required: true },
  valueOnNegativeClick: { type: null, default: true, required: false },
  valueOnPositiveClick: { type: null, default: false, required: false },
  positiveCondition: { type: Function, default: ( val ) => !!val, required: false },
  mainContainerTr: { type: Boolean, default: false, required: false },
  slotContainerTr: { type: Boolean, default: false, required: false },
} );

defineEmits( [ 'update:modelValue' ] );
</script>

<style scoped lang="scss">

</style>
