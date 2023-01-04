import { defineStore } from 'pinia';
import authRepository from 'src/repositories/authRepository.js';
import { defaultApiError } from 'src/errorHandling.js';
import { Notify } from 'quasar';
import { usePermissionStore } from 'stores/permissionStore.js';

let permissionStore = usePermissionStore();


export const useUserStore = defineStore( 'user', {
  state: () => ( {
    permissions: [],
    user: {},
  } ),
  actions: {
    async authenticate( identifier, password ) {
      let response;
      try {
        response = await authRepository.login( { identifier, password } );
        localStorage.setItem( 'token', response.jwt );
        this.router.getRoutes();
        permissionStore.setPermissions( response.user.permissions );
        this.router.push( '/' );
      } catch ( e ) {
        console.log( e );
        defaultApiError( e );
      }
    },
    async forgotPassword( email ) {
      try {
        let response = await authRepository.forgotPassword( { email } );
        Notify.create( {
          type: 'positive',
          message: 'Instructions were sent to the provided Email Address.'
        } );
        return response;
      } catch ( e ) {
        defaultApiError( e );
      }
    },
    async logout(){
      localStorage.removeItem( 'token' );
      this.router.go();
    },
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'user',
        storage: localStorage,
      },
    ],
  }
} );
