<template>
  <DefaultCreate
    :title="t( 'people.create.title' )"
    @submit.prevent="create()"
  >
    <CreateSection
      title="General Info"
      text="General information about the person."
    >
      <TextInput
        v-model="people.firstName"
        :label="t( 'people.create.firstName' )"
        required
      />
      <TextInput
        v-model="people.lastName"
        :label="t( 'people.create.lastName' )"
        required
      />
      <TextInput
        v-model="people.contactEmail"
        :label="t( 'people.create.contactEmail' )"
        required
      />
      <TextInput
        v-model="people.contactPhone"
        :label="t( 'people.create.contactPhone' )"
        required
      />
    </CreateSection>
  </DefaultCreate>
</template>

<script setup>
import DefaultCreate from 'components/general/forms/DefaultCreate.vue';
import TextInput from 'components/general/inputs/TextInput.vue';
import { ApiConnector } from '@/apiConnector.js';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { useI18n } from "vue-i18n";
import CreateSection from "components/general/forms/create/CreateSection.vue";

const { t }= useI18n( { useScope: 'global' } );

const router = useRouter();
let personConnector = new ApiConnector( 'people' );
let people = ref( {} );


function create(){
  personConnector.create( { data: people.value, postCreateHandler: ()=> router.push( { name: 'people.list' } ) } );
}

</script>

<style scoped>

</style>
