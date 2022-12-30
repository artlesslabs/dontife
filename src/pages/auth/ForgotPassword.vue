<template>
  <q-form
    ref="forgotPasswordForm"
    @submit.prevent="submitForgotPassword( username )"
  >
    <q-card-section class="row justify-center">
      <p class="text-h6">
        {{ t( 'authentication.forgotPassword.title' ) }}
      </p>
    </q-card-section>
    <q-card-section>
      <p>
        {{ t( "authentication.forgotPassword.text" ) }}
      </p>
      <TextInput
        v-model="username"
        internal-label
        rounded
        margin="q-mb-sm"
        bg-color="white"
        required
        width="100%"
        :label="t( 'authentication.forgotPassword.placeholder' )"
      />
    </q-card-section>
    <q-card-actions class="row">
      <DefaultButton
        round
        style="background-color: #FECF61"
        to="login"
      >
        <q-icon name="arrow_back" />
      </DefaultButton>
      <q-space />
      <DefaultButton
        rounded
        style="background-color: #FECF61"
        @click="submitForgotPassword( username )"
      >
        {{ t( "authentication.forgotPassword.button" ) }}
      </DefaultButton>
    </q-card-actions>
  </q-form>
</template>

<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useUserStore } from 'stores/userStore.js';
import TextInput from 'components/general/inputs/TextInput.vue';
import DefaultButton from "components/general/DefaultButton.vue";


const { forgotPassword } = useUserStore();
const { t } = useI18n();

let username = ref( '' );
let forgotPasswordForm = ref( null );

async function submitForgotPassword( username ){
  if ( await forgotPasswordForm.value.validate() ){
    forgotPassword( username );
  }
}

</script>

<style scoped>

</style>
