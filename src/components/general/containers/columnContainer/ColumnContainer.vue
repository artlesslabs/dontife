<template>
  <div>
    <div :class="`column column-container-container q-pa-md`">
      <div :class="`col-container shadow-${elevation}`">
        <div
          v-if="columnTitle"
          class="row items-center q-px-md q-pa-sm col-title-container text-white"
        >
          <q-icon
            v-if="icon"
            :name="icon"
            size="xl"
            class="q-mr-sm"
            color="white"
          />
          <p class="text-h6 q-ma-none text-center">
            {{ columnTitle }}
          </p>
        </div>
        <div class="row">
          <div class="col">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { elevationValidator } from '@/propValidators.js';

defineProps( {
  /**
   * Sets the shadow takes values from 0 to 24
   */
  elevation: { type: String, default: '', required: false, validator: elevationValidator },
  /**
   * Sets the title of the container, if no value is set title container is hidden
   */
  columnTitle: { type: String, default: '', required: false },
  /**
   * Prepends an icon to the title.
   */
  icon: { type: String, default: '', required: false },
  /**
   * Title container background color.
   */
  titleBackground: { type: String, default: '#8a8a8a', required: false },
  /**
   * Title container background color.
   */
  contentBackground: { type: String, default: '#ffffff', required: false },

  width: { type: String, default: 'auto', required: false },
} );
</script>

<style scoped lang="scss">
.col-title-container{
  background-color: $title-gray;
}

.col-container{
  max-width: 100%;
  border-radius: 5px;
  background-color: white;
  overflow: hidden;
}

.column-container-container{
  max-width: 100%;
  width: v-bind( width )!important;
}

</style>

