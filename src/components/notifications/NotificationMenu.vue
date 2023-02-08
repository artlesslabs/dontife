<template>
  <DefaultButton
    flat
    round
    margin="q-mr-sm"
    :icon="notifications ? 'notifications':'notifications_active'"
  >
    <q-badge
      v-if="unreadNotificationCount"
      color="red"
      floating
    >
      {{ unreadNotificationCount }}
    </q-badge>
    <q-menu>
      <q-list
        style="max-height: 260px; max-width: 330px; overflow-y:scroll"
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
            <q-item-section avatar>
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
              >
                {{ notification.text }}
              </q-item-label>
            </q-item-section>
            <q-item-section
              class="notification-actions-container"
              side
            >
              <div>
                <DefaultButton
                  v-if="!notification.read"
                  color="primary"
                  flat
                  margin="5px"
                  size="sm"
                  icon="fa-solid fa-eye"
                  @click="( event )=>event.stopImmediatePropagation( markNotificationRead( notification.id ) )"
                >
                  <DefaultTooltip>Read</DefaultTooltip>
                </DefaultButton>
                <DefaultButton
                  color="negative"
                  flat
                  size="sm"
                  margin="5px"
                  icon="mdi-delete"
                  @click="( event )=>event.stopImmediatePropagation( markNotificationDeleted( notification.id ) )"
                >
                  <DefaultTooltip>Delete</DefaultTooltip>
                </DefaultButton>
              </div>
            </q-item-section>
          </q-item>
        </div>
        <q-separator />
      </q-list>
      <div
        v-if="!( notifications.length === localPagination?.total )"
        class="row justify-center"
      >
        <DefaultButton
          round
          flat
          color="primary"
          class="text-center"
          icon="mdi-arrow-down-bold"
          @click="fetchNextPage"
        >
          <q-badge
            v-if="pendingUnreadNotificationCount"
            floating
            color="red"
            rounded
          >
            {{ pendingUnreadNotificationCount }}
          </q-badge>
          <DefaultTooltip>View more</DefaultTooltip>
        </DefaultButton>
      </div>
    </q-menu>
  </DefaultButton>
</template>

<script setup>
import { ApiConnector } from "@/apiConnector.js";
import DefaultButton from "components/general/DefaultButton.vue";
import DefaultTooltip from "components/general/DefaultTooltip.vue";
import { computed, ref } from "vue";

let notifications = ref( [] );
let notificationConnector = new ApiConnector( 'notifications' );
let unreadNotificationCount = ref( 0 );
let localPagination = ref( {} );

let pendingUnreadNotificationCount = computed( ()=> notifications.value.length > unreadNotificationCount.value ? 0 : ( unreadNotificationCount.value - notifications.value.length ) );

function fetchNextPage(){
  fetchNotifications( { page: parseInt( localPagination.value.page ) + 1, pageSize: localPagination.value.pageSize } );
}

async function fetchNotifications( pagination = { page: 1, pageSize: 5 } ){
  let { data, meta } = ( await notificationConnector.me( { pagination } ) );
  notifications.value = [ ...notifications.value, ...data.notifications ];
  localPagination.value = meta.pagination;
  unreadNotificationCount.value = data.unreadCount;
  return meta;
}

async function markNotificationRead( id ){
 let read = await notificationConnector.markRead( id );
 if( read.data === 'success' ){
   fetchNotifications();
 }
}

async function markNotificationDeleted( id ){
  let deleted = await notificationConnector.markDeleted( id );
  if( deleted.data === 'success' ){
    fetchNotifications();
  }
}

fetchNotifications();

</script>

<style lang="scss" scoped>
.info-background{
  background-color: rgba(23,89,124,0.5);
}

.warning-background{
  background-color: rgba(242,192,55,0.5);
}

.error-background{
  background-color: rgba(192,0,21,0.5);
}

.notification-actions-container{
  padding-left: 0px!important;
}

</style>
