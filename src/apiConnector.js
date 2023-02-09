import { Notify } from 'quasar';
import repositoryFactory from "@/repositories/repositoryFactory.js";
import { i18n } from 'boot/i18n.js';
import notifications from "@/repositories/customPaths/notifications.js";
let { t } = i18n.global;

class ApiConnector {
  repository;
  #availableRepositories = {
    leads: '/leads',
    people: '/people',
    users: '/users',
    profiles: '/profiles',
    leadUpdates: '/lead-updates',
    taxDetails: '/tax-details',
    roles: '/users-permissions/roles',
    notifications: { path: '/strapi-notifications/notification', customPaths: notifications },
    entityNotifications: '/strapi-notifications/entity-notifications',
    userProfiles: '/user-profiles',
  };

  constructor( repositoryName ) {
    let repositoryData = this.#availableRepositories[repositoryName];
    let { path, customPaths } = repositoryData;
    this.repository = repositoryFactory( path ?? repositoryData, customPaths ?? undefined );
    for ( const fn of Object.keys( this.repository ) ) {
      if ( !this[fn] ) {
        Object.assign( this, {
          async [fn]( ...params ) {
            return await this.repository[fn]( ...params );
          }
        } );
      }
    }
  }

  async find( params ){
    try {
      return await this.repository.find( params );
    } catch ( e ) {
      console.log( e );
    }
  }

  async findOne( {
   id,
   query,
   errorActions= [ { label: t( 'findOne.errorActions.label' ), color: 'white', handler: ()=> { } } ],
   postFindHandler = ()=>{},
   errorMessage
 } ){
    try {
      let response = await this.repository.findOne( id, query );
      postFindHandler( response );
      return response;
    } catch ( e ) {
      Notify.create( {
        timeout: 0,
        type: 'negative',
        message: errorMessage ?? `Couldn't fetch data, error ${e.message}.`,
        actions: errorActions,
      } );
    }
  }

  async update( {
    data,
    postUpdateHandler = ()=>{},
    errorActions=[ { label: t( 'update.errorActions.label' ), color: 'white', handler: ()=>{}, } ],
    successActions=[],
    successMessage,
    errorMessage,
  } ){
    try {
      let response = await this.repository.update( data );
      Notify.create( {
        type: 'positive',
        message: successMessage ?? `Record ${data.id} was updated successfully.`,
        actions: successActions
      } );
      postUpdateHandler( response );
      return response;
    } catch ( e ) {
      Notify.create( {
        timeout: 0,
        type: 'negative',
        message: errorMessage ?? `Couldn't update record, error ${e.message}.`,
        actions: errorActions,
      } );
    }
  }

  async create( {
    data,
    postCreateHandler = ()=>{},
    errorActions=[ { label: t( 'create.errorActions.label' ), color: 'white', handler: ()=>{}, } ],
    successActions=[],
    successMessage,
    errorMessage,
  } ){
    try {
      let response = await this.repository.create( data );
      Notify.create( {
        type: 'positive',
        message: successMessage ?? `Record ${response.id} was create successfully.`,
        actions: successActions
      } );
      postCreateHandler( response );
      return response;
    } catch ( e ) {
      Notify.create( {
        timeout: 0,
        type: 'negative',
        message: errorMessage ?? `Couldn't create record, error ${e.message}.`,
        actions: errorActions,
      } );
    }
  }

  async bulkCreate( {
    data,
    postCreateHandler = ()=>{},
    errorActions=[ { label: t( 'bulkCreate.defaultErrorActions.label' ), color: 'white', handler: ()=>{}, } ],
    successActions=[],
    successMessage,
    errorMessage,
  } ){
    try {
      let response = await this.repository.bulkCreate( data );
      Notify.create( {
        type: 'positive',
        message: successMessage ?? `${response.length} Records were created successfully.`,
        actions: successActions
      } );
      postCreateHandler( response );
      return response;
    } catch ( e ) {
      Notify.create( {
        timeout: 0,
        type: 'negative',
        message: errorMessage ?? `Couldn't create records: ${e.message}.`,
        actions: errorActions,
      } );
    }
  }

  async delete( {
    id,
    postDeleteHandler = ()=>{},
    errorActions=[ { label: "Dismiss", color: 'white', handler: ()=>{}, } ],
    successActions=[],
    successMessage,
    errorMessage,
  } ){
    try {
      let response = await this.repository.delete( id );
      Notify.create( {
        type: 'positive',
        message: successMessage ?? `Record ${response.id} was deleted successfully.`,
        actions: successActions
      } );
      postDeleteHandler( response );
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
}

export { ApiConnector };
