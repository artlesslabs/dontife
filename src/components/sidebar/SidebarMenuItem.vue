<template>
  <q-item
    :to="to"
    :active-class="activeClass"
    :class="`${itemClass} ${ submenu ? submenuItemClass : '' }`"
  >
    <q-avatar
      class="side-menu-list-avatar"
      square
      size="sm"
      font-size="24px"
    >
      <q-icon
        class="item-icon"
        size="20px"
        :name="icon"
      />
    </q-avatar>
    <q-item-section class="q-pl-md title-section">
      {{ title }}
    </q-item-section>
  </q-item>
</template>

<script setup>
defineProps( {
  icon: { type: String, default: '', required: false },
  title: { type: String, default: '', required: false },
  to: { type: String, default: '', required: false },
  activeClass: { type: String, default: 'menu-item-active', required: false },
  itemClass: { type: String, default: 'menu-item', required: false },
  submenuItemClass: { type: String, default: 'submenu-drawer', required: false },
  submenu: { type: Boolean, default: false, required: false }
} );
</script>

<style scoped lang="scss">
.menu-item-active{
  .side-menu-list-avatar{
    color: #FECF61;
  }
  .title-section{
    border-radius: 24px;
  }
}

.submenu-drawer{
  padding-left: 24px;
  max-height: 100%;
  background-color: rgba(255,255,255,0.3);
  position: relative;
}

.side-menu-list-avatar{
  margin: 4px;
}

.item-icon {
  overflow: visible;
  filter: drop-shadow(0px 2px 3px rgb(0 0 0 / 0.5));
}

</style>
