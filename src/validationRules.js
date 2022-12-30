import { i18n } from 'boot/i18n.js';
import _ from 'lodash';
import { date } from 'quasar';
let { t } = i18n.global;

export const rRequired = val => !!val || t( 'validation.required' );
export const arrayRequired = val => { return !_.isEmpty( val ) || t( 'validation.required' ); };
export const isBool = val => parseInt( val ) === 0 || parseInt( val ) === 1 || t( 'validation.isBool' );
export const isZipCode = val => /^\d{5}(?:-\d{4})?$/.test( val ) || !val || t( 'validation.zipCode' );
export const isNumber = val => parseInt( val ) == val || !val || t( 'validation.isNumber' );
export const isEmail = val => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test( val ) || !val || t( 'validation.isEmail' );
export const isDate = ( val ) => ( !isNaN( Date.parse( val ) ) || !val || t( 'validation.isDate' ) );

export const isDateDDMMYYYY = ( val ) => {
  if ( val.length<10 ){
    return ( !val || t( 'validation.isDate' ) );
  } else {
    return ( !isNaN( date.extractDate( val, 'DD/MM/YYYY' ).getDate() ) || t( 'validation.isDate' ) );
  }
};
