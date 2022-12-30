<template>
  <DefaultCreate
    :title="t( 'user.create.title' )"
    @submit.prevent="create()"
  >
    <CreateSection
      title="General Info"
      text="General Information about the user."
    >
      <TextInput
        v-model="user.username"
        :label="t( 'user.create.userName' )"
        required
      />
      <TextInput
        v-model="user.email"
        :label="t( 'user.create.email' )"
        required
      />
      <PasswordInput
        v-model="user.password"
        :label="t( 'user.create.password' )"
        required
      />
      <DefaultToggle
        v-model="user.confirmed"
        :label="t( 'user.create.confirmed' )"
      />
      <DefaultToggle
        v-model="user.blocked"
        :label="t( 'user.create.blocked' )"
      />
      <DefaultSelect
        v-model="user.role"
        :label="t( 'user.create.rol' )"
        :options="[ { label: t( 'user.create.optionRol.administrator' ), value: '3' } ]"
      />
    </CreateSection>
    <CreateSection
      title="Person"
      text="Please select or create a person to which this user account will be related."
    >
      <MagicSelect
        v-model="user.person"
        add-button-label="Add Person"
        label="Person"
        :filter-options="personFilters"
        :creation-form-fields="personCreationFormField"
        label-field="firstName"
        :search-visualization-text="( el )=>`${el.id}-${el.firstName} ${el.lastName }`"
        model="people"
        :editable="true"
      />
    </CreateSection>
  </DefaultCreate>
</template>

<script setup>
import { useRouter } from 'vue-router';
import TextInput from 'components/general/inputs/TextInput.vue';
import { ref } from 'vue';
import DefaultCreate from 'components/general/forms/DefaultCreate.vue';
import PasswordInput from 'components/general/inputs/PasswordInput.vue';
import DefaultToggle from 'components/general/inputs/DefaultToggle.vue';
import DefaultSelect from 'components/general/inputs/DefaultSelect.vue';
import { useUserStore } from 'stores/userStore.js';
import { useI18n } from "vue-i18n";
import CreateSection from "components/general/forms/create/CreateSection.vue";
import MagicSelect from "components/general/inputs/MagicSelect.vue";

const { t } = useI18n( { useScope: 'global' } );

const userStore = useUserStore();
let user = ref( { confirmed: false, blocked: false } );

const personFilters = [ {
  label: t( 'user.create.personFilters.firstName' ),
  value: 'firstName'
}, { label: t( 'user.create.personFilters.lastName' ), value: 'lastName' } ];
let personCreationFormField = [ {
  label: t( 'collaborator.view.personCreationFormField.firstName' ),
  value: 'firstName',
  type: 'text',
  required: true
},
  { label: t( 'user.create.personCreationFormField.lastName' ), value: 'lastName', type: 'text', required: true },
  { label: t( 'user.create.personCreationFormField.contactEmail' ), value: 'contactEmail', type: 'text', required: true },
  { label: t( 'user.create.personCreationFormField.contactPhone' ), value: 'contactPhone', type: 'text', required: true } ];


const router = useRouter();

function create() {
  let payload = { ...user.value, person: user.value.person.id };
  userStore.create( { user: payload, postCreateHandler: () => router.push( { name: 'users.list' } ) } );
}

</script>

<style scoped>

</style>
