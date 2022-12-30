import { defineStore } from 'pinia';
import _ from 'lodash';

export const usePermissionStore = defineStore( 'permission', {
  state: () => ( {
    permissions: {},
    scopePermissions: [],
    sidebarItems: [],
  } ),
  actions: {
    setPermissions( permissions ){
      this.permissions = permissions;
      this.sidebarItems = this.getMenu( permissions );

    },
    getMenu( permissions ){
      let menuItems = this.router.getRoutes().filter( ( el )=> el.meta.menu ).map( ( { meta, name, path, children } )=> {
            return {
              meta,
              name,
              path,
              submenus: children.map( ( { meta, name, path } )=>{
                  return { meta, name, path, };
                } ).filter( ( el )=> el.meta?.submenu ) };
        } );
      // eslint-disable-next-line no-unused-vars
      let menuPermissions = [];
      for ( let item of menuItems ){
        let allowedChildren = item.submenus.filter( ( el )=> Object.keys( permissions ).includes( el.name ) );
        if( allowedChildren.length>0 ){
          menuPermissions.push( { ...item, submenus: allowedChildren } );
        } else if ( Object.keys( permissions ).includes( item.name ) ) {
          menuPermissions.push( { ...item } );
        }
      }
      return menuPermissions;
    },
    setScope( scope ){
      let foundPermissions = _.get( this.permissions, scope, false );
      if ( foundPermissions ) {
        this.scopePermissions = JSON.parse( JSON.stringify( foundPermissions ) );
      }
    },
    isAllowed( name, scope = null ){
      if ( scope ){
        console.log( _.get( this.permissions, `${scope}`, [] ) );
        let scopedPermissions =_.get( this.permissions, `${scope}`, [] );
        return scopedPermissions.includes( name );
      } else {
        return this.scopePermissions.includes( name );
      }
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'user',
        storage: localStorage,
      },
    ],
  }
} );
