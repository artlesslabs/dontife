<template>
  <div :class="`row ${isDesktop?'q-mt-sm q-px-md':'q-mx-sm q-mt-sm q-pa-xs'} justify-center card-container`">
    <q-card
      class="q-pa-md shadow-2"
      :class="`create-form ${isDesktop ? 'q-pa-lg default-create-container' : 'q-pa-sm default-create-container-mobile'}`"
    >
      <q-form @submit.prevent="createRecord()">
        <q-card-section>
          <span class="text-h4">{{ title }}</span>
          <div class="justify-center">
            <slot />
          </div>
          <div class="row">
            <q-space />
            <div
              class="row"
            >
              <DefaultButton
                button-style="primary"
                :loading="createLoading"
                @click="cancelCreation()"
              >
                Cancel
              </DefaultButton>
              <DefaultButton
                button-style="primary"
                :loading="createLoading"
                type="submit"
              >
                Save
              </DefaultButton>
            </div>
          </div>
        </q-card-section>
      </q-form>
    </q-card>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import DefaultButton from 'components/general/DefaultButton.vue';
import { computed, ref } from 'vue';
import { useQuasar } from 'quasar';

let $q= useQuasar();
const isDesktop = computed( ()=>$q.screen.gt.sm );

let route = useRoute();
let props = defineProps( {
  title: { type: String, default: '' },
  createFunction: { type: Function, required: true },
  modelValue: { type: [ Object, null ], default: null }
} );

if ( route.query ){
  emit( 'update:modelValue', route.query );
}

let emit = defineEmits( [ 'submit', 'update:modelValue' ] );

const router = useRouter();
let createLoading = ref( false );
function cancelCreation(){
  router.go( -1 );
}


async function createRecord(){
  if ( !createLoading.value ){
    createLoading.value = true;
    try {
      await props.createFunction();
    }
    catch ( e ) {
      console.log( e.message );
    }
    createLoading.value = false;
  }
}

</script>

<style scoped lang="scss">

.default-create-container{
  width: 100%;
  background-color: rgba(255,255,255,0.7);
  border-radius: 41px;
}
.default-create-container-mobile{
  min-width: 0;
  max-width: 100% ;
  background-color: rgba(255,255,255,0.7);
  border-radius: 15px;

}
</style>
