<template>
  <DefaultCreate
    :title="t( 'lead.create.title' )"
    :create-function="create"
  >
    <CreateSection
      title="Lead"
      text="General information about the lead"
    >
      <DefaultSelect
        v-model="lead.type"
        :label="t( 'lead.create.type' )"
        :options="[ { label: t( 'lead.create.options.legalEntity' ), value: 'legalEntity' }, { label: t( 'lead.create.options.individual' ), value: 'individual' } ]"
      />
      <TextInput
        v-if="lead.type === 'legalEntity'"
        v-model="lead.data.legalName"
        :label="t( 'lead.create.legalName' )"
      />
      <TextInput
        v-model="lead.data.firstName"
        :label="t( 'lead.create.firstName' )"
      />
      <TextInput
        v-model="lead.data.lastName"
        :label="t( 'lead.create.lastName' )"
      />
      <TextInput
        v-model="lead.data.email"
        :label="t( 'lead.create.contactEmail' )"
      />
      <TextInput
        v-model="lead.data.phone"
        :label="t( 'lead.create.contactPhone' )"
      />
    </CreateSection>

    <CreateSection
      title="Address"
      text="Add lead address"
    >
      <TextInput
        v-model="lead.data.streetAddress"
        :label="t( 'lead.create.streetAddress' )"
      />
      <TextInput
        v-model="lead.data.settlement"
        :label="t( 'lead.create.settlement' )"
      />
      <TextInput
        v-model="lead.data.city"
        :label="t( 'lead.create.city' )"
      />
      <TextInput
        v-model="lead.data.state"
        :label="t( 'lead.create.state' )"
      />
      <TextInput
        v-model="lead.data.zipcode"
        :label="t( 'lead.create.zipcode' )"
      />
      <TextInput
        v-model="lead.data.country"
        :label="t( 'lead.create.country' )"
      />
      <TextInput
        v-model="lead.data.references"
        :label="t( 'lead.create.references' )"
      />
    </CreateSection>
    <CreateSection
      title="Lead"
      text="Select the status"
    >
      <DefaultSelect
        v-model="lead.status"
        :label="t( 'lead.create.status' )"
        :options="[ { label: 'Created', value: 'created' } ]"
      />
    </CreateSection>
  </DefaultCreate>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import DefaultCreate from "components/general/forms/DefaultCreate.vue";
import { ApiConnector } from '@/apiConnector.js';
import DefaultSelect from "components/general/inputs/DefaultSelect.vue";
import TextInput from "components/general/inputs/TextInput.vue";
import { useI18n } from "vue-i18n";
import CreateSection from "components/general/forms/create/CreateSection.vue";

const { t }= useI18n( { useScope: 'global' } );

const leadConnector = new ApiConnector( 'leads' );
const router = useRouter();
let lead = ref( { data: {}, status: 'created' } );

function create(){
  let payload = JSON.parse( JSON.stringify( lead.value ) );
  leadConnector.create( { data: payload, postCreateHandler: ()=> router.push( { name: 'leads.list' } ) } );
}
</script>

<style scoped>

</style>
