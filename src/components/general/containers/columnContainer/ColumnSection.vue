<template>
  <ColumnSectionTitle
    v-if="externalTitle && sectionTitle"
    :title="sectionTitle"
    :bg-color="titleBgColor || '#9f9f9f'"
    :color="titleColor || '#ffffff'"
    :append-button="expandable ? expandButton : false"
    @append-button-click="expandElement"
  />
  <div
    ref="expandableItem"
    :class="`collapsible  ${ ( !expandable || ( expandable && expanded ) ) ? '': 'collapsed' }`"
  >
    <ColumnSectionTitle
      v-if="!externalTitle && sectionTitle"
      :title="sectionTitle"
      :bg-color="titleBgColor"
      :color="titleColor || '#000000'"
      :append-button="expandable ? expandButton : false"
      @append-button-click="expanded = !expanded"
    />
    <div
      :class="`column ${noGutters?'':'q-pa-md'}`"
    >
      <div :class="`${row? 'row':''} column-section`">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import ColumnSectionTitle from 'components/general/containers/columnContainer/ColumnSectionTitle.vue';
import { ref } from 'vue';

let expanded = ref( false );
let expandableItem = ref( null );

function expandElement( ) {
  let collapseClass = 'collapsed';
  // debugger;
  expandableItem.value.style.height = '';
  expandableItem.value.style.transition = 'none';

  const startHeight = window.getComputedStyle( expandableItem.value ).height;

  // Remove the collapse class, and force a layout calculation to get the final height
  expandableItem.value.classList.toggle( collapseClass );
  const height = window.getComputedStyle( expandableItem.value ).height;

  // Set the start height to begin the transition
  expandableItem.value.style.height = startHeight;

  // wait until the next frame so that everything has time to update before starting the transition
  requestAnimationFrame( () => {
    expandableItem.value.style.transition = '';

    requestAnimationFrame( () => {
      expandableItem.value.style.height = height;
    } );
  } );

  // Clear the saved height values after the transition
  expandableItem.value.addEventListener( 'transitionend', dropHeight );

  expandableItem.value.removeEventListener( 'transitionend', dropHeight );
}

function dropHeight( ){
  return expandableItem.value.style.height = '';
}

defineProps( {
  expandable: { type: Boolean, default: false },
  row: { type: Boolean, default: false },
  backgroundColor: { type: String, default: null },
  noGutters: { type: Boolean, default: false },
  externalTitle: { type: Boolean, default: false },
  elevation: { type: String, default: '' },
  sectionTitle: { type: String, default: '' },
  icon: { type: String, default: null },
  titleColor: { type: String, default: '' },
  titleBgColor: { type: String, default: '' }
} );

let expandButton = {
  type: 'icon',
  flat: true,
  round: true,
};

</script>

<style lang="scss" scoped>

.collapsible {
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.25, 0.8, 0.5, 1);
  height: auto;
}

.collapsible.collapsed {
  height: 0;
  padding-top: 0;
  padding-bottom: 0;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.25, 0.8, 0.5, 1);
}
.column-section{
  max-width: 100%;
}
</style>
