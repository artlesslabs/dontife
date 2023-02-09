<template>
  <q-drawer
    ref="navDrawer"
    :model-value="modelValue"
    class="navigation-drawer"
    persistent
    show-if-above
    mini-width="130"
    :mini="miniState && !settingsShown && !notificationShown"
    side="left"
    @mouseover="miniState = false"
    @mouseout="miniState = true"
    @update:model-value="$emit( 'update:modelValue', !modelValue )"
  >
    <div class="q-pa-sm logo-container">
      <div class="row justify-center">
        <q-img
          src="@/assets/logo-white.png"
          fit="contain"
          width="100px"
          height="64px"
        />
      </div>
    </div>
    <div
      class="navbar-list-container overflow-hidden"
      style="margin:0 30px; height: calc(100% - 85px);"
    >
      <q-scroll-area style="height: 100%">
        <q-list
          class="overflow-hidden"
        >
          <div
            v-for="link in permissionStore.sidebarItems"
            :key="link.name"
          >
            <SidebarMenuItem
              v-if="link.submenus?.length == false"
              :to="link.path"
              :title="link.meta.title"
              :icon="link.meta.icon"
            />
            <SidebarSubmenu
              v-else
              v-model="expanded[link.name]"
              :title="link.meta.title"
              :icon="link.meta.icon"
              group="submenus"
              :default-opened="route.matched[1].path === link.path"
            >
              <SidebarMenuItem
                v-for="subroute of link.submenus"
                :key="subroute.name"
                :to="`${link.path}/${subroute.path}`"
                :title="subroute.meta?.title"
                :icon="subroute.meta?.icon"
                submenu
              />
            </SidebarSubmenu>
          </div>
        </q-list>
      </q-scroll-area>

      <q-list class="notification-section">
        <q-item
          class="row full-width side-menu-list"
          clickable
        >
          <q-item-section class="row items-center full-width title-section">
            <NotificationMenu v-model="notificationShown" />
          </q-item-section>
        </q-item>
      </q-list>

      <q-list class="logout-section">
        <q-item
          class="row items-center full-width side-menu-list"
          clickable
        >
          <DefaultButton
            color="primary"
            size="sm"
            round
            padding="none"
            margin="none"
            flat
            @click="( event )=> event.stopImmediatePropagation( goToUserProfile() )"
          >
            <q-avatar
              round
              size="40px"
            >
              <img :src="`${contentURL}${userProfile.avatar?.url}`">
            </q-avatar>
          </DefaultButton>
          <q-item-section class="logout-text q-pl-md">
            <div class="row items-center justify-between">
              <span class="text-capitalize col-10">{{ userStore.user?.person?.fullname }}</span>
              <DefaultButton
                class="col-2"
                color="primary"
                icon="mdi-cog"
                size="sm"
                round
                padding="none"
                margin="none"
                flat
              >
                <q-menu
                  v-model="settingsShown"
                  :offset="[ 20, 5 ]"
                >
                  <DefaultButton
                    padding="none"
                    margin="none"
                    class="lang-btn"
                    flat
                    color="negative"
                    dense
                    @click="userStore.logout()"
                  >
                    LogOut
                  </DefaultButton>
                </q-menu>
              </DefaultButton>
            </div>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-drawer>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SidebarSubmenu from "components/sidebar/SidebarSubmenu.vue";
import SidebarMenuItem from "components/sidebar/SidebarMenuItem.vue";
import { usePermissionStore } from "stores/permissionStore.js";
import { useUserStore } from 'stores/userStore.js';
import DefaultButton from "components/general/DefaultButton.vue";
import NotificationMenu from "components/notifications/NotificationMenu.vue";
import { contentURL } from "@/constants.js";
import { ApiConnector } from "@/apiConnector.js";


let userStore = useUserStore();
let permissionStore = usePermissionStore();
const userProfileConnector = new ApiConnector( 'userProfiles' );
let route = useRoute();
let expanded = ref( {} );
let miniState= ref( true );
let settingsShown = ref( false );
let notificationShown = ref( false );
const router = useRouter();

defineProps( {
  modelValue: { type: Boolean, default: false }
} );
let navDrawer = ref( null );
defineEmits( [ 'update:modelValue' ] );
let userProfile = ref( { files: {} } );

function goToUserProfile(){
  console.log( 'prueba' );
  router.push( { name: 'usersProfile.view', params: { id: userStore.user.id } } );
}

async function findUserProfile(){
  userProfile.value = ( await userProfileConnector.find( { filters: { usersPermissionsUser: userStore.user?.id } } ) ).data[0];
  userProfile.value.files = {};
}
findUserProfile();

</script>

<style lang="scss" scoped>

.logout-text{
  border-bottom: solid $primary 2px;
  text-align: left;
}

.notification-section{
  width: 100%;
  position: absolute;
  bottom: 0;
  margin-bottom: 85px;
}

.navigation-bar{
  min-height: 80px;
  width: auto;
  background-color: rgb(64,60,60);
}

.logout-section{
  width: 100%;
  position: absolute;
  bottom: 0;
  margin-bottom: 15px;
}

</style>

<style lang="scss">

.navigation-drawer {
  background-color: transparent!important;
  padding: 5px;
}

.navbar-list-container{
  font-size: 14px;
  max-height: 100%;
  background: rgba(255,255,255,0.5);
  border-radius: 41px;
  position: relative;
}

</style>

