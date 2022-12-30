<template>
  <div class="visualization-table">
    <div
      class="visualization-header"
    >
      <template
        v-for="( field, idx ) of fields"
        :key="idx"
      >
        <span
          class="visualization-cell"
          :class="`${labelColor.charAt( 0 ) === '$' ? `text-${labelColor.substring( 1 )}`:''} visualization-item-label`"
          :style="`${labelColor.charAt( 0 ) !== '$' ? `color:${labelColor}`:''}`"
        >
          {{ field.label }}:
        </span>
      </template>
    </div>
    <div
      v-for="( el, idx ) of value"
      :key="idx"
      class="visualization-row"
    >
      <div
        v-for="( field, idx ) of fields"
        :key="idx"
        class="visualization-cell"
      >
        <p
          :class="`${textColor.charAt( 0 ) === '$' ? `text-${textColor.substring( 1 )}`:''} visualization-item-value`"
          :style="`${textColor.charAt( 0 ) !== '$' ? `color:${textColor}`:''}`"
        >
          {{ _.isFunction( field.value ) ? field.value( el ) : el[field.value] }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import _ from 'lodash';

defineProps( {
  row: { type: Boolean, default: true },
  labelColor: { type: String, default: '$primary' },
  textColor: { type: String, default: '' },
  fields: { type: Object, default: ()=>{} },
  value: { type: Array, default: ()=>[] }
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

.visualization-header{
  display: table-header-group;
}
.visualization-cell{
  display: table-cell;
  padding-right: 10px;
}

.visualization-table{
  display: table;
}

</style>
