import Repository from 'src/repositories/axios.js';
import qs from 'qs';

const route = '/leads';

export default {
  async find( params ){
    const parsedParams = qs.stringify( params, { encodeValuesOnly: true } );
    return ( await Repository.get( `${route}?${parsedParams}` ) ).data;
  },
  async findOne( id ){
    return ( await Repository.get( `${route}/${id}` ) ).data.data;
  },
  async create( data ){
    return ( await Repository.post( route, { data } ) ).data.data;
  },
  async bulkCreate( data ){
    return ( await Repository.post( `${route}/bulk-create`, { data } ) ).data.data;
  },
  async update( { id, ...rest } ){
    return ( await Repository.put( `${route}/${id}`, { data: rest } ) ).data.data;
  },
  async delete( id ){
    return ( await Repository.delete( `${route}/${id}` ) ).data.data;
  },
};
