<template>
  <q-form
    ref="loginForm"
    @keyup.enter="login( username, password )"
  >
    <q-card-section class="row justify-center">
      <div class="col q-px-lg-lg q-px-sm">
        <TextInput
          v-model="username"
          internal-label
          rounded
          margin="q-mb-sm"
          bg-color="white"
          required
          width="100%"
          :label="t( 'authentication.login.usernameInput' )"
        />
        <PasswordInput
          v-model="password"
          internal-label
          bg-color="white"
          margin="none"
          rounded
          width="100%"
          :label="t( 'authentication.login.passwordInput' )"
        />
      </div>
    </q-card-section>
    <q-card-section class="row justify-center">
      <div class="col q-px-lg-lg q-px-sm">
        <DefaultButton
          style="background: #FECF61; color: #0D1117"
          rounded
          margin="q-mb-sm"
          class="btn-fixed-width"
          @click="login( username, password )"
        >
          {{ t( 'authentication.login.loginButton' ) }}
        </DefaultButton>
        <DefaultButton
          flat
          rounded
          to="forgot-password"
          margin="none"
          class="btn-fixed-width"
          style="color: #FECF61"
        >
          {{ t( 'authentication.login.forgotPasswordButton' ) }}
        </DefaultButton>
      </div>
    </q-card-section>
  </q-form>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';
import { useUserStore } from 'stores/userStore.js';
import { useI18n } from 'vue-i18n';
import PasswordInput from 'components/general/inputs/PasswordInput.vue';
import TextInput from 'components/general/inputs/TextInput.vue';
import DefaultButton from "components/general/DefaultButton.vue";
const { t } = useI18n();
const userStore = useUserStore();
const loginForm = ref( null );

onBeforeMount( ()=>{
  userStore.$reset();
  localStorage.clear();
} );

let username = ref( '' );
let password = ref( '' );

async function login( username, password ){
  if ( await loginForm.value.validate() ){
    await userStore.authenticate( username, password );
  }
}
</script>

<style lang="scss" scoped>

.btn-fixed-width{
  width: 100%;
  text-transform: capitalize;
}
.login-button-container{
  button{
    margin-left: 10px;
  }
}
</style>
