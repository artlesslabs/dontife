<template>
  <div
    v-if="!hideOnEdit || !editable"
    class="col-auto editable-toggle-container"
  >
    <q-skeleton
      v-if="loading"
      width="100%"
      type="QToggle"
      class="q-mb-md q-ml-sm"
    />
    <DefaultToggle
      v-else-if="editable"
      v-bind="props"
      :model-value="modelValue"
      @update:model-value="( evt ) => $emit( 'update:modelValue', evt )"
    />
    <div
      v-else
      :class="`${row ? 'row':''}`"
    >
      <span
        :class="`${labelColor.charAt( 0 ) === '$' ? `text-${labelColor.substring( 1 )}`:''} editable-toggle-label`"
        :style="`${labelColor.charAt( 0 ) !== '$' ? `color:${labelColor}`:''}`"
      >
        {{ label }}:
      </span>
      <q-icon
        size="md"
        :name="modelValue ? 'mdi-check' : 'mdi-close'"
        :class="`${
          modelValue ?
            ( positiveColor.charAt( 0 ) === '$' ? `text-${positiveColor.substring( 1 )}` : '' ) :
            ( negativeColor.charAt( 0 ) === '$' ? `text-${negativeColor.substring( 1 )}` : '' )
        }`"
        :style="`${
          modelValue ?
            ( positiveColor.charAt( 0 ) !== '$' ? `color:${positiveColor}` : '' ) :
            ( negativeColor.charAt( 0 ) !== '$' ? `color:${negativeColor}` : '' )
        }`"
      />
    </div>
  </div>
</template>

<script setup>
import DefaultToggle from 'components/general/inputs/DefaultToggle.vue';

let props = defineProps( {
  width: { type: String, default: 'auto' },
  loading: { type: Boolean, default: false },
  labelColor: { type: String, default: '$primary' },
  positiveColor: { type: String, default: '$positive' },
  negativeColor: { type: String, default: '$negative' },
  row: { type: Boolean, default: true },
  label: { type: String, default: '' },
  editable: { type: Boolean, default: false },
  modelValue: { type: Boolean, default: false },
  hideOnEdit: { type: Boolean, default: false }
} );

defineEmits( [ 'update:modelValue' ] );

</script>

<style lang="scss" scoped>
.editable-toggle-label{
  font-weight: 400;
  width: 120px;
}
.editable-toggle-field{
}
.editable-toggle-container{
  width: v-bind( 'width' );
}

</style>
