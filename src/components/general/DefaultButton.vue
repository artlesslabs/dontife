<template>
  <q-btn
    :class="`${margin} default-button`"
    :style="`${ round || icon ? '' : `padding:${padding};`} ${ minHeight ? `min-height:${ minHeight };`:'' }`"
    size="13px"
    :round="round"
    :loading="loading"
    :icon="icon"
    :href="href"
    :to="to"
    v-bind="{ ...buttonDefinition[buttonStyle], ...$attrs }"
  >
    <slot />
  </q-btn>
</template>

<script setup>
import { computed, reactive } from 'vue';
import { useQuasar } from 'quasar';

defineProps( {
  buttonStyle: {
    type: String,
    default: 'default'
  },
  round: { type: Boolean, default: false, required: false },
  loading: { type: Boolean, default: false, required: false },
  icon: { type: [ String, undefined ], default: undefined, required: false },
  minHeight: { type: [ Boolean, String ], default: false, required: false },
  margin: {
    type: String,
    default: 'q-ma-sm'
  },
  padding: {
    type: String,
    default: '4px 16px'
  },
  href: {
    type: String,
    default: undefined
  },
  to: {
    type: [ String, Object ],
    default: undefined
  },
  height: {
    type: String,
    default: '30px',
  }
} );
const $q = reactive( {} );
$q.value = useQuasar();
const buttonDefinition = computed( () => {
  return {
    primary: {
      color: $q.value.dark.isActive ? 'primary-dark' : 'primary',
      rounded: true,
    },
    secondary: {
      color: $q.value.dark.isActive ? 'primary-dark' : 'primary',
      rounded: true,
    },
    tertiary: {
      color: 'negative',
      rounded: true,
    },
    navBar: {
      rounded: true,
      outline: false,
      color: 'primary'
    },
    delete: {
      color: 'negative',
      rounded: true
    },
  };
} );
</script>

<style scoped lang="scss">
.default-button{
  height: v-bind( height );
}

</style>
