<template>
  <div class="row">
    <div :class="`${isDesktop?'col':''} data-section`">
      <div class="q-mt-md section-divider" />
      <h6
        v-if="title"
        :class="`q-ma-none ${isDesktop ? 'full-width' : ''} section-title`"
      >
        {{ title }}
      </h6>
      <p>
        {{ text }}
      </p>
    </div>
    <div :class="`${isDesktop?'col-auto':''} q-pt-md create-section-container`">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useQuasar } from 'quasar';

let $q= useQuasar();
const isDesktop = computed( ()=>$q.screen.gt.sm );

defineProps( {
  title: { type: [ String, Boolean ], default: false },
  text: { type: String, default: '' }
} );

</script>

<style scoped>
.section-divider{
  border-top: 1px #e0e0e0 solid;
}

.data-section{
  padding-right: 20px;
}

.section-title{
  font-weight: 400;
  text-transform: capitalize;
}

.create-section-container{
  max-width: 100%;
}

</style>
