import { defineStore } from 'pinia';
import authRepository from 'src/repositories/authRepository.js';
import { defaultApiError } from 'src/errorHandling.js';
import { Notify } from 'quasar';
import { usePermissionStore } from 'stores/permissionStore.js';
import { ApiConnector } from "@/apiConnector.js";

const userConnector = new ApiConnector( 'users' );

export const useUserStore = defineStore( 'user', {
  state: () => ( {
    user: {},
  } ),
  actions: {
    async authenticate( identifier, password ) {
      let permissionStore = usePermissionStore();
      let response;
      try {
        response = await authRepository.login( { identifier, password } );
        localStorage.setItem( 'token', response.jwt );
        let { permissions, ...user } = await userConnector.findOne( { id: response.user.id, query: { populate: [ 'role', 'profiles', 'person' ] } } );
        this.user=user;
        this.router.getRoutes();
        permissionStore.setPermissions( permissions );
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
      console.log( 'p' );
      this.router.push( { name: 'auth.login' } );
    },
  },
  persist: {
    key: 'user',
    storage: localStorage,
  }
} );
