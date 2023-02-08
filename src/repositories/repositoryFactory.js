import Repository from 'src/repositories/axios.js';
import qs from 'qs';
import _ from "lodash";

export default ( route, customPaths ) =>( {
  async find( params ) {
    const parsedParams = qs.stringify( params, { encodeValuesOnly: true } );
    return ( await Repository.get( `${route}?${parsedParams}` ) ).data;
  },
  async findOne( id, params = {} ) {
    const parsedParams = qs.stringify( params, { encodeValuesOnly: true } );
    return ( await Repository.get( `${route}/${id}?${parsedParams}` ) ).data.data;
  },
  async create( data ) {
    let { files, ...rest } = data;
    if ( files ) {
      let fileCounter = 0;
      let formData = new FormData();
      for ( let key of Object.keys( files ) ) {
        if ( _.isArray( files[key] ) ) {
          for ( const file of files[key] ) {
            formData.append( `files.${key}`, file, files[key].name );
            fileCounter++;
          }
        } else if ( files[key] ){
          formData.append( `files.${key}`, files[key], files[key].name );
          fileCounter++;
        }
      }
      formData.append( 'data', JSON.stringify( rest ) );
      return ( await Repository.post( route, fileCounter > 0 ? formData: { data: rest } ) ).data.data;
    } else {
      return ( await Repository.post( route, { data: rest } ) ).data.data;
    }
  },
  async bulkCreate( data ) {
    return ( await Repository.post( `${route}/bulk-create`, { data } ) ).data.data;
  },
  async update( data ) {
    let { id, files, ...rest } = data;
    if ( files ) {
      let formData = new FormData();
      for ( let key of Object.keys( files ) ) {
        if ( _.isArray( files[key] ) && files[key].length > 0 ) {
          for ( const file of files[key] ) {
            formData.append( `files.${key}`, file, files[key].name );
          }
        } else {
          if ( files[key]?.name ) {
            formData.append( `files.${key}`, files[key], files[key].name );
          }
        }
      }
      formData.append( 'data', JSON.stringify( rest ) );
      return ( await Repository.put( `${route}/${id}`, formData ) ).data.data;
    } else {
      return ( await Repository.put( `${route}/${id}`, { data: rest } ) ).data.data;
    }
  },
  async delete( id ) {
    return ( await Repository.delete( `${route}/${id}` ) ).data.data;
  },
  ...( customPaths ? customPaths( Repository ) : {} )
} );
