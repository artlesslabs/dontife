import { Notify } from 'quasar';

export const defaultApiError = ( e )=>{
  if( e.response ) {
    Notify.create( {
      type: 'negative',
      message: e.response.data.error.message
    } );
  } else {
    Notify.create( {
      type: 'negative',
      message: e.message
    } );
  }
};
