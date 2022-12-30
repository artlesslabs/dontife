import Repository from 'src/repositories/axios.js';

const route = '/auth';

export default {
  async login( data ){
    let response = await Repository.post( `${route}/local`, data );
    return response.data;
  },
  async forgotPassword( data ){
    let response = await Repository.post( `${route}/forgot-password`, data );
    return response.data;
  },
  async resetPassword( data ){
    let response = await Repository.post( `${route}/reset-password`, data );
    return response.data;
  }
};
