<template>
  <div :class="`${margin}`">
    <label
      v-if="!internalLabel && label"
      class="label"
      for="qinput"
    >
      {{ label }}
    </label>
    <q-input
      v-bind="$attrs"
      ref="qinput"
      :mask="mask"
      :label="internalLabel ? label : undefined"
      :dense="dense"
      :outlined="outlined"
      class="default-input"
      :rules="[ required ? rRequired:'', ...rules ]"
      rounded
    >
      <template
        v-for="( _, slot ) in $slots"
        #[slot]
      >
        <slot
          :name="slot"
        />
      </template>
    </q-input>
  </div>
</template>

<script setup>
import { rRequired } from '@/validationRules';
import { ref } from 'vue';

const qinput = ref( null );

function validate(){
  qinput.value.validate();
}

function hasError(){
  return qinput.value.hasError;
}

defineExpose( { validate, hasError } );

defineProps( {
  internalLabel: { type: Boolean, default: false },
  outlined: { type: Boolean, default: true },
  dense: { type: Boolean, default: true },
  margin: { type: String, default: 'q-mr-sm' },
  label: { type: String, default: '' },
  mask: { type: [ String, undefined ], default: undefined, required: false },
  width: { type: String, default: '230px' },
  height: { type: String, default: 'auto' },
  rules: { type: Array, default: ()=>[] },
  required: { type: Boolean, default: false },
} );
</script>

<style scoped lang="scss">
  .default-input{
    width: v-bind( width );
    max-width: 100%;
    height: v-bind( height );
    :deep(.q-field__control-container){
      padding: 0!important;
      text-align: center;
    }
  }
  .label{font-size: 13px}
</style>
