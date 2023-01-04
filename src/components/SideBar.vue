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
          <q-avatar
            class="side-menu-list-avatar"
            size="sm"
            font-size="24px"
          >
            <q-icon name="mdi-bell-badge" />
          </q-avatar>
          <q-item-section class="q-pl-md title-section">
            <p>
              Notification
            </p>
            <q-badge
              color="red"
              text-color="white"
              floating
            >
              {{ readNotificationsCount }}
            </q-badge>
            <q-menu
              v-model="notificationShown"
              transition-show="flip-right"
              transition-hide="flip-left"
              anchor="bottom right"
              class="overflow-hidden"
            >
              <q-list
                style="max-height: 260px; max-width: 250px; overflow-y:scroll"
              >
                <div
                  v-for="notification of notifications"
                  :key="notification"
                  :class="`${notification.read ? '' : ( notification.type === 'info' ? 'info-background' : notification.type === 'warning' ? 'warning-background' : 'error-background' )}`"
                >
                  <q-item
                    v-ripple
                    clickable
                  >
                    <q-item-section
                      top
                      avatar
                    >
                      <q-avatar
                        v-if="notification.type === 'info'"
                        color="primary"
                        text-color="white"
                        icon="mdi-information"
                      />
                      <q-avatar
                        v-if="notification.type === 'warning'"
                        class="prueba1"
                        color="warning"
                        text-color="white"
                        icon="mdi-alert"
                      />
                      <q-avatar
                        v-if="notification.type === 'error'"
                        color="negative"
                        text-color="white"
                        icon="mdi-close-circle"
                      />
                    </q-item-section>

                    <q-item-section>
                      <q-item-label>{{ notification.title }}</q-item-label>
                      <q-item-label
                        caption
                        lines="2"
                      >
                        {{ notification.message }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </div>
                <q-separator />
              </q-list>
              <div class="row justify-center">
                <DefaultButton
                  round
                  flat
                  color="primary"
                  class="text-center"
                  icon="mdi-arrow-down-bold"
                  @click="viewNotification"
                >
                  <q-badge
                    floating
                    color="red"
                    rounded
                  >
                    {{ readNotificationsCount }}
                  </q-badge>
                  <DefaultTooltip>View more</DefaultTooltip>
                </DefaultButton>
              </div>
            </q-menu>
          </q-item-section>
        </q-item>
      </q-list>

      <q-list class="logout-section">
        <q-item
          class="row items-center full-width side-menu-list"
          clickable
        >
          <q-avatar
            class="side-menu-list-avatar"
            size="lg"
            font-size="44px"
          >
            <img src="https://cdn.quasar.dev/img/boy-avatar.png">
          </q-avatar>
          <q-item-section class="logout-text q-pl-md">
            <div class="row items-center justify-between">
              <span class="text-capitalize col-10">Gerardo Landeros</span>
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
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import SidebarSubmenu from "components/sidebar/SidebarSubmenu.vue";
import SidebarMenuItem from "components/sidebar/SidebarMenuItem.vue";
import { usePermissionStore } from "stores/permissionStore.js";
import { useUserStore } from 'stores/userStore.js';
import DefaultButton from "components/general/DefaultButton.vue";
import DefaultTooltip from "components/general/DefaultTooltip.vue";


let userStore = useUserStore();
let permissionStore = usePermissionStore();
let route = useRoute();
let expanded = ref( {} );
let miniState= ref( true );
let settingsShown = ref( false );
let notificationShown = ref( false );
let notifications = ref( [] );
let readNotificationsCount = computed( ()=>notifications.value.filter( ( el )=>!el.read ).length );

notifications.value = [
  { type: 'warning', title: 'prueba', message: 'este es un mensaje de prueba donde se crearon nuevos clientes', read: false },
  { type: 'info', title: 'prueba', message: 'este es un mensaje de prueba 2', read: false },
  { type: 'error', title: 'prueba', message: 'este es un mensaje de prueba 3', read: false },
  { type: 'warning', title: 'prueba', message: 'este es un mensaje de prueba 4', read: true },
];

function viewNotification(){
  notifications.value.push( ...notifications.value );
}

defineProps( {
  modelValue: { type: Boolean, default: false }
} );
let navDrawer = ref( null );
defineEmits( [ 'update:modelValue' ] );

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

.info-background{
  background-color: rgba(23,89,124,0.5);
}

.warning-background{
  background-color: rgba(242,192,55,0.5);
}

.error-background{
  background-color: rgba(192,0,21,0.5);
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

