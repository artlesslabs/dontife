<template>
  <div
    :class="`${row ? 'row' : ''} q-ma-sm visualization-row`"
  >
    <span
      class="visualization-cell"
      :class="`${labelColor.charAt( 0 ) === '$' ? `text-${labelColor.substring( 1 )}`:''} visualization-item-label`"
      :style="`${labelColor.charAt( 0 ) !== '$' ? `color:${labelColor}`:''}`"
    >
      {{ label }}:
    </span>
    <slot name="value">
      <p
        :class="`${textColor.charAt( 0 ) === '$' ? `text-${textColor.substring( 1 )}`:''} visualization-item-value q-mb-sm`"
        :style="`${textColor.charAt( 0 ) !== '$' ? `color:${textColor}`:''}`"
      >
        {{ value }}
      </p>
    </slot>
  </div>
</template>

<script setup>

defineProps( {
  row: { type: Boolean, default: true },
  labelColor: { type: String, default: '$primary' },
  textColor: { type: String, default: '' },
  label: { type: String, default: '' },
  value: { type: [ String, Number ], default: '' }
} );

</script>

<style lang="scss" scoped>
.visualization-item-label{
  font-weight: 400;
}
.visualization-item-value{
}
.visualization-item-container{
  width: v-bind( 'width' );
}

.visualization-row{
  display: table-row;
}
.visualization-cell{
  display: table-cell;
  padding-right: 10px;
}

</style>
