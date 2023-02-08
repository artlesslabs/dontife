<template>
  <div :class="`${margin}`">
    <label
      class="label"
      for="qselect"
    >
      {{ label }}
    </label>
    <q-select
      v-bind="$attrs"
      ref="qselect"
      dense
      class="default-input"
      :rules="[ required ? rRequired:'', ...rules ]"
      :multiple="multiple"
      emit-value
      outlined
      map-options
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
    </q-select>
  </div>
</template>

<script setup>
import { rRequired } from '@/validationRules';

defineProps( {
  internalLabel: { type: Boolean, default: false },
  margin: { type: String, default: 'q-mr-sm' },
  label: { type: String, default: '' },
  width: { type: [ Number, String ], default: '230px' },
  rules: { type: Array, default: ()=>[] },
  required: { type: Boolean, default: false },
  multiple: { type: Boolean, default: false }
} );

</script>

<style lang="scss" scoped>
  .default-input{
    width: v-bind( width );
    min-width: 100px;
    max-width: 100%;
  }
  .label{font-size: 13px}
</style>
