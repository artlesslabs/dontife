<template>
  <q-expansion-item
    :active-class="activeClass"
    :class="submenuClass"
    :default-opened="defaultOpened"
  >
    <template #header>
      <q-avatar
        class="submenu-avatar"
        size="sm"
        font-size="24px"
      >
        <q-icon :name="icon" />
      </q-avatar>
      <q-item-section class="q-pl-md side-menu-text">
        {{ title }}
      </q-item-section>
    </template>
    <slot />
  </q-expansion-item>
</template>

<script setup>

defineProps( {
  title: { type: String, required: true },
  icon: { type: String, default: '', required: false },
  defaultOpened: { type: Boolean, default: false, required: false },
  group: { type: String, default: undefined, required: false },
  activeClass: { type: String, default: '', required: false },
  submenuClass: { type: String, default: 'side-menu-list', required: false },
} );

</script>

<style scoped lang="scss">

.side-menu-list-active{
  .submenu-text{
    background-color: $primary;
    border-radius: 24px;
  }
}

.side-submenu-list-active{
  :deep(.side-menu-text){
    background-color: #03527c;
    border-radius: 24px;
  }
}

.submenu-avatar{
  margin: 4px;
}

</style>
