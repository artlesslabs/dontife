<template>
  <div class="q-mr-sm">
    <label
      v-if="!internalLabel && label"
      class="label"
      for="qinput"
    >
      {{ label }}
    </label>
    <q-file
      v-bind="$attrs"
      dense
      outlined
      class="file-input"
      :rules="[ required ? rRequired:'', ...rules ]"
    >
      <template #prepend>
        <q-icon
          name="attach_file"
          @click.stop.prevent
        />
      </template>
    </q-file>
  </div>
</template>

<script setup>
import { rRequired } from '@/validationRules.js';
defineProps( {
  internalLabel: { type: Boolean, default: false },
  width: { type: String, default: '230px' },
  label: { type: String, default: '' },
  rules: { type: Array, default: ()=>[] },
  required: { type: Boolean, default: false }
} );
</script>

<style lang="scss" scoped>

.file-input{
  width: v-bind( width );
}
.label{font-size: 13px}
</style>
