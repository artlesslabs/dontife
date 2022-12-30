<template>
  <q-item
    :to="to"
    :active-class="activeClass"
    :class="`${itemClass} ${ submenu ? submenuItemClass : '' }`"
  >
    <q-avatar
      class="side-menu-list-avatar"
      size="sm"
      font-size="24px"
    >
      <q-icon :name="icon" />
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
    color: orange;
  }
  .title-section{
    background-color: orange;
    border-radius: 24px;
  }
}

.submenu-drawer{
  max-height: 100%;
  background-color: (255, 255, 255, 0.9);
  position: relative;
}

.side-menu-list-avatar{
  margin: 4px;
}

</style>
