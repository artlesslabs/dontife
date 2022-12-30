import _ from 'lodash';
import { date } from 'quasar';

export const formatDateInput = ( inputDate, format = 'YYYY/MM/DD' )=>{
  if( inputDate ){
    let yyyy = inputDate.slice( 0, 4 );
    let mm = inputDate.slice( 5, 7 );
    let dd = inputDate.slice( 8, 10 );
    if ( format === 'YYYY/MM/DD' ) {
      return `${yyyy}/${mm}/${dd}`;
    }else {
      return date.formatDate( `${yyyy}/${mm}/${dd}`, format );
    }
  } else {
    return inputDate;
  }
};

export const formatDateISO = ( date )=>{
  let yyyy = date.slice( 0, 2 );
  let mm = date.slice( 3, 5 );
  let dd = date.slice( 6, 10 );
  return new Date( `${yyyy}/${mm}/${dd}` ).toISOString();
};

export const removeEmpty = ( obj )=> {
  // eslint-disable-next-line no-unused-vars
  return Object.fromEntries( Object.entries( obj ).filter( ( [ _, v ] ) => v != false || v === 0 ) );
};

export const searchQueryBuilder = ( filter, searchString, searchFields )=>{
  let processedSearchElements = [];
  let processedFilterElements = { '$and': [] };

  if ( searchString ){
    for ( let field of searchFields ) {
      if ( field.filterConfig?.filterFields ){
        for ( let el of field.filterConfig.filterFields ){
          let processedField = unflatten( { [el]: { $contains: searchString } } );
          processedSearchElements.push( processedField );
        }
      } else {
        let processedField = unflatten( { [field.name]: { $contains: searchString } } );
        processedSearchElements.push( processedField );
      }
    }
  }

  for ( let key of Object.keys( filter ) ){
    let multiFilterField = searchFields.filter( ( el )=>el.name === key )[0].filterConfig?.filterFields;
    if ( multiFilterField ){
      let multiFilterElement = { '$or': [] };
      for ( let el of multiFilterField ){
        multiFilterElement['$or'].push( unflatten( { [el]: { $contains: filter[key] } } ) );
      }
      processedFilterElements['$and'].push( multiFilterElement );
    } else {
      if ( filter[key] === true || filter[key] === false || key === 'id' ) {
        processedFilterElements[key] = { $eq: filter[key] };
      } else if ( _.isArray( filter[key] ) ) {
        processedFilterElements[key] = { $in: filter[key] };
      } else {
        processedFilterElements[key] = { $contains: filter[key] };
      }
    }
  }

  processedFilterElements = unflatten( processedFilterElements );

  const searchQuery = { '$or': processedSearchElements, ...processedFilterElements };

  return searchQuery;
};

export const unflatten = ( data ) => {
  let result = {};
  for ( let i in data ) {
    let keys = i.split( '.' );
    keys.reduce( function( r, e, j ) {
      return r[e] || ( r[e] = isNaN( Number( keys[j + 1] ) ) ? ( keys.length - 1 == j ? data[i] : {} ) : [] );
    }, result );
  }
  return result;
};
