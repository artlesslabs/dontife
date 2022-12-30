<template>
  <div
    class="row col-section-title"
    :class="`${bgColor.charAt( 0 ) === '$' ? `bg-${bgColor.substring( 1 )}`:''}`"
    :style="`${bgColor.charAt( 0 ) !== '$' ? `background-color:${bgColor}`:''}`"
  >
    <slot name="icon-prepend">
      <ColumnSectionTitleIcon
        v-if="icon"
        :class="`${iconColor.charAt( 0 ) === '$' ? `text-${iconColor.substring( 1 )}`:''}`"
        :style="`${iconColor.charAt( 0 ) !== '$' ? `color:${iconColor}`:''}`"
        :name="icon"
      />
    </slot>
    <p
      :class="`${color.charAt( 0 ) === '$' ? `text-${color.substring( 1 )}`:''}`"
      :style="`${color.charAt( 0 ) !== '$' ? `color:${color}`:''}`"
    >
      <slot>
        {{ title }}
      </slot>
    </p>
    <q-space v-if="appendButton" />
    <DefaultButton
      v-if="appendButton"
      margin="none"
      size="md"
      padding="0 0"
      height="24px"
      :round="appendButton.round"
      :icon="'mdi-chevron-down'"
      :flat="appendButton.flat"
      @click="$emit( 'appendButtonClick' )"
    />
  </div>
</template>

<script setup>
import ColumnSectionTitleIcon from 'components/general/containers/columnContainer/ColumnSectionTitleIcon.vue';
import DefaultButton from 'components/general/DefaultButton.vue';
defineProps( {
  appendButton: { type: Object, default: null },
  icon: { type: String, default: null },
  title: { type: String, default: null },
  iconColor: { type: String, default: '' },
  bgColor: { type: String, default: '' },
  color: { type: String, default: 'black' },
} );

defineEmits( [ 'appendButtonClick' ] );
</script>

<style lang="scss" scoped>
.col-section-title{
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
