import axios from 'axios';
import { apiURL } from 'src/constants.js';
import { normalize } from '@/repositories/repositoryHelpers.js';


const axiosInstance = axios.create( { baseURL: apiURL } );

axiosInstance.interceptors.request.use( ( request )=>{
  const token = localStorage.getItem( 'token' );
  request.headers.Authorization = token ? `Bearer ${token}` : '';
  return request;
} );

axiosInstance.interceptors.response.use( ( response )=>{
  response.data.data = normalize( response.data.data );
  return response;
} );

export default axiosInstance;
