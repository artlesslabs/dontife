import { defineStore } from 'pinia';
import authRepository from 'src/repositories/authRepository.js';
import { defaultApiError } from 'src/errorHandling.js';
import { Notify } from 'quasar';
import userRepository from "@/repositories/userRepository";
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
    async find(){
      try {
        return await userRepository.find();
      } catch ( e ) {
        console.log( e );
      }
    },
    async findOne( {
                     id,
                     errorActions= [ { label: "Dismiss", color: 'white', handler: ()=> { } } ],
                     postFindHandle = ()=>{},
                     errorMessage
                   } ){
      try {
        let response = await userRepository.findOne( id );
        postFindHandle( response );
        return response;
      } catch ( e ) {
        Notify.create( {
          timeout: 0,
          type: 'negative',
          message: errorMessage ?? `Couldn't fetch data, error ${e.message}.`,
          actions: errorActions,
        } );
      }
    },
    async create( {
                    user,
                    postCreateHandle = ()=>{},
                    errorActions=[ { label: "Dismiss", color: 'white', handler: ()=>{}, } ],
                    successActions=[],
                    successMessage,
                    errorMessage,
                  } ){
      try {
        let response = await userRepository.create( user );
        Notify.create( {
          type: 'positive',
          message: successMessage ?? `Record ${response.id} was create successfully.`,
          actions: successActions
        } );
        postCreateHandle( response );
        return response;
      } catch ( e ) {
        console.log( e.toJSON() );
        Notify.create( {
          timeout: 0,
          type: 'negative',
          message: errorMessage ?? `Couldn't create record, error ${e.response.data.error.message}.`,
          actions: errorActions,
        } );
      }
    },
    async update( {
                    user,
                    postUpdateHandle = ()=>{},
                    errorActions=[ { label: "Dismiss", color: 'white', handler: ()=>{}, } ],
                    successActions=[],
                    successMessage,
                    errorMessage,
                  } ){
      try {
        let response = await userRepository.update( user );
        Notify.create( {
          type: 'positive',
          message: successMessage ?? `Record ${user.id} was updated successfully.`,
          actions: successActions
        } );
        console.log( postUpdateHandle );
        postUpdateHandle( response );
        return response;
      } catch ( e ) {
        Notify.create( {
          timeout: 0,
          type: 'negative',
          message: errorMessage ?? `Couldn't update record, error ${e.message}.`,
          actions: errorActions,
        } );
      }
    },
    async delete( {
                    id,
                    postDeleteHandle = ()=>{},
                    errorActions=[ { label: "Dismiss", color: 'white', handler: ()=>{}, } ],
                    successActions=[],
                    successMessage,
                    errorMessage,
                  } ){
      try {
        let response = await userRepository.delete( id );
        Notify.create( {
          type: 'positive',
          message: successMessage ?? `Record ${response.id} was deleted successfully.`,
          actions: successActions
        } );
        postDeleteHandle( response );
        return response;
      } catch ( e ) {
        Notify.create( {
          timeout: 0,
          type: 'negative',
          message: errorMessage ?? `Couldn't delete record, error ${e.message}.`,
          actions: errorActions,
        } );
      }
    }
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
