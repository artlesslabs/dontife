import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router';
import routes from './routes';
import { usePermissionStore } from 'stores/permissionStore.js';

const createHistory = process.env.SERVER
  ? createMemoryHistory
  : ( process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory );

const router = createRouter( {
  scrollBehavior: () => ( { left: 0, top: 0 } ),
  routes,

  history: createHistory( process.env.VUE_ROUTER_BASE )
} );

router.beforeEach( ( to, from, next )=>{
  // eslint-disable-next-line no-unused-vars
  let permissionStore = usePermissionStore();
  const hasAuthToken = !!localStorage.getItem( 'token' );
  if ( to.matched.some( ( record ) => record.meta.requiresAuth ) ) {
    if ( !hasAuthToken ) {
      next( {
        path: '/auth/login',
        params: { nextUrl: to.fullPath },
      } );
    } else {
      let isAllowed = permissionStore.isAllowed( 'view', to.name );
      if ( !isAllowed ) {
        next( { name: 'notAllowed' } );
      } else {
        next();
      }
    }
  } else if ( to.matched[0].name === 'auth' && hasAuthToken ) {
    next( { path: '/' } );
  } else{
    next();
  }
} );

export default router;
