import Repository from 'src/repositories/axios.js';
import qs from 'qs';

const route = '/users';

export default {
  async find( params ){
    const parsedParams = qs.stringify( params, { encodeValuesOnly: true } );
    return ( await Repository.get( `${route}?${parsedParams}` ) );
  },
  async me(){
    return ( await Repository.get( `${route}/me` ) ).data;
  },
  async findOne( id ){
    return ( await Repository.get( `${route}/${id}` ) ).data;
  },
  async create( data ){
    return ( await Repository.post( route, data ) ).data;
  },
  async update( { id, ...rest } ){
    return ( await Repository.put( `${route}/${id}`, rest ) ).data;
  },
  async delete( id ){
    return ( await Repository.delete( `${route}/${id}` ) ).data;
  },
};
