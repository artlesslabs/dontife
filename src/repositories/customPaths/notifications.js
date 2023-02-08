import qs from "qs";

let route = '/strapi-notifications/notifications';

export default ( Repository ) => ( {
  async me( params ) {
    const parsedParams = qs.stringify( params, { encodeValuesOnly: true } );
    return ( await Repository.get( `${route}/me?${parsedParams}` ) ).data;
  },
  async markRead( id ) {
    return ( await Repository.get( `${route}/mark-read/${id}` ) ).data;
  },
  async markDeleted( id ) {
    return ( await Repository.get( `${route}/mark-deleted/${id}` ) ).data;
  },
} );
