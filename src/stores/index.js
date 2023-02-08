import { store } from 'quasar/wrappers';
import { createPinia } from 'pinia';
import { markRaw } from 'vue';
import router from 'src/router/index.js';
import piniaPersist from 'pinia-plugin-persistedstate';

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store( ( /* { ssrContext } */ ) => {
  const pinia = createPinia();
  pinia.use( piniaPersist );

  pinia.use( ( { store } )=>store.router = markRaw( router ) );

  return pinia;
} );
