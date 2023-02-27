<template>
  <DefaultEdit
    v-model:editable="editMode"
    :loading="loading"
    :title="t( 'user.view.title', { id: userStore.user.id } )"
    :cancel-edition="cancelEdition"
    :update-function="update"
  >
    <template #default="props">
      <div class="row">
        <ColumnContainer
          class="col-auto"
          column-title="User Profile"
          elevation="2"
        >
          <ColumnSection
            row
          >
            <div class="q-px-lg">
              <q-item
                v-ripple
                clickable
              >
                <q-item-section>
                  <q-avatar
                    round
                    size="180px"
                  >
                    <img :src="`${contentURL}${userProfile.avatar?.url}`">
                  </q-avatar>
                </q-item-section>
              </q-item>
            </div>
            <div>
              <EditableFile
                v-if="editMode"
                v-model="userProfile.files.avatar"
                label="Image Profile"
                :remove-file-function="removeImage"
                :current-files="userProfile.avatar"
                v-bind="props"
                :disable="!editMode"
                :required="!userProfile.avatar"
              />
              <div class="section-title">
                <p
                  class="text-black"
                >
                  General Info
                </p>
              </div>
              <EditableText
                v-model="user.person.firstName"
                v-bind="props"
                label="First Name"
              />
              <EditableText
                v-model="user.person.lastName"
                v-bind="props"
                label="Last Name"
              />
              <EditableText
                v-model="user.person.contactPhone"
                v-bind="props"
                label="Contact Phone"
              />
              <EditableText
                v-model="user.username"
                v-bind="props"
                :label="t( 'user.view.userName' )"
              />
              <EditableText
                v-model="user.email"
                v-bind="props"
                :label="t( 'user.view.email' )"
              />
              <EditablePassword
                v-if="editMode"
                v-model="user.password"
                v-bind="props"
                :label="t( 'user.view.password' )"
              />
              <EditableDate
                v-model="userProfile.birthdate"
                v-bind="props"
                label="Birthdate"
              />
              <div>
                <DefaultButton
                  v-if="!taxDetail.id && editMode"
                  ref="button1"
                  button-style="secondary"
                  @click="showTaxDetail = !showTaxDetail"
                >
                  Add Tax Detail
                </DefaultButton>
              </div>
              <div
                v-if="taxDetail.id || showTaxDetail"
              >
                <div class="section-title">
                  <p
                    class="text-black"
                  >
                    Tax Information
                  </p>
                </div>
                <EditableText
                  v-model="taxDetail.rfc"
                  v-bind="props"
                  label="RFC"
                />
                <EditableText
                  v-model="taxDetail.legalName"
                  v-bind="props"
                  label="Legal Name"
                />
                <EditableText
                  v-model="taxDetail.street"
                  v-bind="props"
                  label="Street"
                />
                <EditableText
                  v-model="taxDetail.exteriorNumber"
                  v-bind="props"
                  label="Exterior Number"
                />
                <EditableText
                  v-model="taxDetail.interiorNumber"
                  v-bind="props"
                  label="Interior Number"
                />
                <EditableText
                  v-model="taxDetail.settlement"
                  v-bind="props"
                  label="Settlement"
                />
                <EditableText
                  v-model="taxDetail.zip"
                  v-bind="props"
                  label="Zip Code"
                />
                <EditableText
                  v-model="taxDetail.locality"
                  v-bind="props"
                  label="RFC"
                />
                <EditableText
                  v-model="taxDetail.municipality"
                  v-bind="props"
                  label="Municipality"
                />
                <EditableText
                  v-model="taxDetail.state"
                  v-bind="props"
                  label="State"
                />
              </div>
            </div>
          </ColumnSection>
        </ColumnContainer>
      </div>
      <ActionConfirmation
        v-model="confirmDialog"
        message="Are you sure you want to delete this record?"
        :confirm-handler="deleteRecord"
        :cancel-handler="()=>{ confirmDialog = !confirmDialog }"
      />
    </template>
  </DefaultEdit>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue';
import { ApiConnector } from "@/apiConnector.js";
import DefaultEdit from "components/general/forms/DefaultEdit.vue";
import ColumnContainer from "components/general/containers/columnContainer/ColumnContainer.vue";
import ColumnSection from "components/general/containers/columnContainer/ColumnSection.vue";
import EditableText from "components/general/inputs/editableItems/EditableText.vue";
import EditablePassword from "components/general/inputs/editableItems/EditablePassword.vue";
import ActionConfirmation from "components/general/ActionConfirmation.vue";
import { useI18n } from "vue-i18n";
import { useUserStore } from "stores/userStore.js";
import EditableDate from "components/general/inputs/editableItems/EditableDate.vue";
import EditableFile from "components/general/inputs/editableItems/EditableFile.vue";
import { contentURL } from "@/constants.js";
import DefaultButton from "components/general/DefaultButton.vue";

let userStore = useUserStore();
let showTaxDetail = ref( false );
const { t }= useI18n( { useScope: 'global' } );
const router = useRouter();
const userConnector = new ApiConnector( 'users' );
const taxDetailConnector = new ApiConnector( 'taxDetails' );
const userProfileConnector = new ApiConnector( 'userProfiles' );
let editMode = ref( false );
let loading = ref( false );
let confirmDialog = ref( false );


//Get Route Params
const route = useRoute();
let id = ref( route.params.id );

async function deleteRecord(){
  await userConnector.delete( { id: id.value } );
  confirmDialog.value = false;
  router.push( { name: 'users.list' } );
}

//Get User Data
let user = ref( { person: {} } );
let taxDetail = ref( {} );
let userProfile = ref( { files: {} } );

const findUserErrorActions = [
  {
    label: "Try again",
    class: 'q-mx-xs',
    color: 'white',
    rounded: true,
    outline: true,
    handler: ()=>findUserProfile(),
  },
  {
    label: "Go to list view",
    class: 'q-mx-xs',
    color: 'white',
    rounded: true,
    flat: true,
    handler: ()=>router.go( -1 ),
  }
];
async function findUserProfile(){
  taxDetail.value = ( await taxDetailConnector.find( { filters: { person: userStore.user?.person?.id } } ) ).data[0];
  if( taxDetail?.value?.id ){
    taxDetail.value;
  }else{
    taxDetail.value= {};
  }
  userProfile.value = ( await userProfileConnector.find( { filters: { usersPermissionsUser: userStore.user?.id } } ) ).data[0];
  userProfile.value.files = {};
  user.value = await userConnector.findOne( { id: userStore.user.id, query: { populate: [ 'person' ] }, errorActions: findUserErrorActions } );
}
findUserProfile();

function removeImage(){
  userProfile.value.avatar={};
}

async function cancelEdition(){
  await findUserProfile();
  editMode.value = false;
}

const UpdateUserErrorActions = [
  {
    label: "Try again",
    class: 'q-mx-xs',
    color: 'white',
    rounded: true,
    outline: true,
    handler: ()=>update(),
  },
  {
    label: "Cancel",
    class: 'q-mx-xs',
    color: 'white',
    rounded: true,
    flat: true,
    handler: ()=>{
      editMode.value=false;
      findUserProfile();
    },
  }
];

async function update(){
  await userConnector.update( {
    user: user.value,
    postUpdateHandler: ()=>{ editMode.value = false; findUserProfile(); },
    actions: UpdateUserErrorActions,
  } );
}

</script>

<style lang="scss" scoped>
.section-title{
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.75rem;
  letter-spacing: 0.00937em;
  text-align: center;
  padding: 8px 16px;
p{
  margin: 0;
}
}
</style>
