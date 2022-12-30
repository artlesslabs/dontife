<template>
  <q-header
    class="navigation-bar row items-center transparent justify-end q-mr-md"
  >
    <q-toolbar class="q-pa-none">
      <DefaultButton
        flat
        round
        icon="menu"
        @click="$emit( 'update:showSidebar', !showSidebar )"
      />
      <q-toolbar-title>
        <div>
          <q-breadcrumbs
            class="breadcrumbs-container"
            active-color="primary"
            style="font-size: 15px"
          >
            <template #separator>
              <q-icon
                size="1.2em"
                name="arrow_forward"
                color="blue-grey-6"
              />
            </template>
            <q-breadcrumbs-el
              v-for="( el, idx ) of breadcrumbs"
              :key="idx"
              :label="el.label"
              :to="el.to"
              :icon="el.icon"
            />
          </q-breadcrumbs>
        </div>
      </q-toolbar-title>

      <div
        v-if="isDesktop"
        class="row"
      >
        <DefaultButton
          v-for="action in route.matched[route.matched.length-1].meta.actions"
          :key="action.text"
          :button-style="action.buttonStyle"
          :to="{ name: action.route, params: action.params }"
        >
          <q-icon
            v-if="action.icon"
            :name="action.icon"
          />
          <span class="q-ml-sm">
            {{ action.text }}
          </span>
        </DefaultButton>
      </div>
    </q-toolbar>
  </q-header>

  <q-page-sticky
    v-if="!isDesktop && route.matched[route.matched.length-1].meta?.actions?.length"
    class="actionFab"
    position="bottom-right"
    :offset="[ 35, 18 ]"
  >
    <q-fab
      color="primary"
      push
      icon="mdi-dots-vertical"
      direction="up"
    >
      <q-fab-action
        v-for="( action, idx ) in route.matched[route.matched.length-1].meta.actions"
        :key="idx"
        color="primary"
        :icon="action.icon"
        :label="action.text"
        :to="{ name: action.route, params: action.params }"
      />
    </q-fab>
  </q-page-sticky>
</template>

<script setup>
import { computed, ref } from 'vue';
import DefaultButton from 'components/general/DefaultButton.vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from "vue-i18n";
import { useUserStore } from "stores/userStore.js";
import { useQuasar } from 'quasar';

defineProps( {
  showSidebar: { type: Boolean, default: false }
} );

let $q = useQuasar();
let userStore = useUserStore();
let router = useRouter();
let { locale } = useI18n( { useScope: 'global' } );
let route = useRoute();
let breadcrumbs = ref( [] );
const isDesktop = computed( ()=>$q.screen.gt.sm );

defineEmits( [ 'update:showSidebar' ] );

if ( userStore.user.userConfig?.lang && locale.value !== userStore.user.userConfig?.lang ) {
  localStorage.setItem( 'lang', userStore.user.userConfig.lang );
  locale.value = userStore.user.userConfig.lang;
  router.go();
}

function setBreadcrumbs(){
  for ( let el of route.matched ) {
    if ( el.path==='/' ){
      breadcrumbs.value.push( { to: '/', label: 'Home', icon: 'mdi-home' } );
    }
    else if ( el.name?.lastIndexOf( '.' ) !== -1 ) {
      let label = el.name?.substring( el.name?.lastIndexOf( '.' ) + 1 );
      let defaultIcon = label === 'list' ? 'mdi-format-list-bulleted' : label === 'view' ? 'mdi-monitor-edit': label === 'create' ? 'mdi-file-document-plus':'';
      label = label.charAt( 0 ).toUpperCase() + label.slice( 1 );
      breadcrumbs.value.push( {
        to: el.path,
        label: label,
        icon: defaultIcon ? defaultIcon : el.meta.icon
      } );
    } else {
      breadcrumbs.value.push( {
        to: el.path,
        label: el.meta.title ? el.meta.title : el.name.charAt( 0 ).toUpperCase() + el.name.slice( 1 ),
        icon: el.meta.icon
      } );
    }
  }
}

setBreadcrumbs();

</script>

<style lang="scss" scoped>
.navigation-bar{
  height: 80px;
  width: auto;
  color: #000000;
  background-color: $navbar-bg;
}
.body--dark {
  .navigation-bar {
    border-bottom: #2c3749 1px solid;
    background-color: $navbar-bg-dark;
  }
}

.lang-btn{
  text-decoration: underline;
  width: auto;
}

</style>

