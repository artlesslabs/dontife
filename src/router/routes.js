import { i18n } from "boot/i18n.js";

let lang = localStorage.getItem( 'lang' );
let { t, locale } = i18n.global;

locale.value = lang || 'en-US';

const routes = [
  {
    path: '/',
    component: () => import( 'layouts/MainLayout.vue' ),
    redirect: '/home',
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: 'bulkCreate/:model',
        name: 'bulkCreate',
        meta: {
          title: 'Bulk Create'
        },
        component: () => import( 'pages/general/BulkCreate.vue' )
      },
      {
        path: 'home',
        name: 'home',
        meta: {
          menu: true,
          icon: 'fa-solid fa-chart-line',
          title: 'Home',
        },
        children: [
          {
            path: '',
            name: 'home.view',
            component: () => import( 'pages/home/HomeView.vue' ),
          },
        ]
      },
      {
        path: 'leads',
        name: 'leads',
        meta: {
          menu: true,
          icon: 'mdi-account-filter',
          title: t( 'lead.menuTitle' ),
        },
        children: [
          {
            path: '',
            name: 'leads.list',
            component: () => import( 'pages/leads/LeadList.vue' ),
            meta: {
              actions: [
                { text: t( 'navbar.button.create' ), route: 'leads.create', buttonStyle: 'navBar', icon: 'mdi-plus' },
                { text: t( 'navbar.button.bulkCreate' ), route: 'bulkCreate', params: { model: 'leads' }, buttonStyle: 'navBar', icon: 'mdi-plus' },
              ]
            },
          },
          {
            path: 'create',
            name: 'leads.create',
            component: () => import( 'pages/leads/LeadCreate.vue' ),
            meta: null,
          },
          {
            path: ':id',
            name: 'leads.view',
            component: () => import( 'pages/leads/LeadView.vue' ),
            meta: null,
          },
        ]
      },
      {
        path: 'orders',
        name: 'orders',
        meta: {
          menu: true,
          icon: 'fa-solid fa-tooth',
          title: t( 'orders.menuTitle' ),
        },
        children: [
          {
            path: '',
            name: 'orders.list',
            component: () => import( 'pages/orders/OrdersList.vue' ),
          },
          {
            path: '',
            name: 'orders.create',
            component: () => import( 'pages/workOrder/OrdersCreate.vue' ),
          },
          {
            path: '',
            name: 'orders.create',
            component: () => import( 'pages/workOrder/OrdersView.vue' ),
          },
        ]
      },
      {
        path: 'new-order',
        name: 'workOrders',
        meta: {
          menu: true,
          icon: 'fa-solid fa-tooth',
          title: t( 'orders.newOrder.menuTitle' ),
        },
        children: [
          {
            path: '',
            name: 'workOrders.create',
            component: () => import( 'pages/workOrder/WorkOrdersCreate.vue' ),
          },
        ]
      },
      {
        path: 'people',
        name: 'people',
        meta: {
          menu: true,
          icon: 'fa-solid fa-users',
          title: t( 'people.menuTitle' ),
        },
        children: [
          {
            path: '',
            name: 'people.list',
            component: () => import( 'pages/people/PeopleList.vue' ),
            meta: {
              actions: [
                { text: t( 'navbar.button.create' ), route: 'people.create', buttonStyle: 'navBar', icon: 'mdi-plus' },
                {
                  text: t( 'navbar.button.bulkCreate' ),
                  route: 'bulkCreate',
                  params: { model: 'users' },
                  buttonStyle: 'navBar',
                  icon: 'mdi-plus'
                },
              ]
            },
          },
          {
            path: 'create',
            name: 'people.create',
            component: () => import( 'pages/people/PeopleCreate.vue' ),
            meta: null,
          },
          {
            path: ':id',
            name: 'people.view',
            component: () => import( 'pages/people/PeopleView.vue' ),
            meta: null,
          },
        ]
      },

      {
        path: 'accessControl',
        name: 'accessControl',
        redirect: 'users',
        meta: {
          menu: true,
          icon: 'fa-solid fa-fingerprint',
          title: 'Access Control',
        },
        children: [
          {
            path: 'users',
            name: 'users',
            meta: {
              submenu: true,
              icon: 'fa-solid fa-user-pen',
              title: t( 'user.menuTitle' ),
            },
            children: [
              {
                path: '',
                name: 'users.list',
                component: () => import( 'pages/users/UsersList.vue' ),
                meta: {
                  actions: [
                    { text: t( 'navbar.button.create' ), route: 'users.create', buttonStyle: 'navBar', icon: 'mdi-plus' },
                    {
                      text: t( 'navbar.button.bulkCreate' ),
                      route: 'bulkCreate',
                      params: { model: 'users' },
                      buttonStyle: 'navBar',
                      icon: 'mdi-plus'
                    },
                  ]
                },
              },
              {
                path: 'create',
                name: 'users.create',
                component: () => import( 'pages/users/UsersCreate.vue' ),
                meta: null,
              },
              {
                path: ':id',
                name: 'users.view',
                component: () => import( 'pages/users/UsersView.vue' ),
                meta: null,
              },
            ]
          },
          {
            path: 'profiles',
            name: 'profiles',
            meta: {
              icon: 'fa-regular fa-id-card',
              title: 'Profiles',
              submenu: true,
            },
            children: [
              {
                path: '',
                name: 'profiles.list',
                component: () => import( 'pages/profiles/ProfileList.vue' ),
              },
            ]
          },
        ]
      },
      {
        path: 'usersProfile',
        name: 'usersProfile',
        meta: {
          menu: true,
          icon: 'fa-solid fa-chart-line',
          title: 'User Profile',
        },
        children: [
          {
            path: '',
            name: 'usersProfile.view',
            component: () => import( 'pages/usersProfile/UsersProfile.vue' ),
          },
        ]
      },
    ]
  },
  {
    path: '/auth',
    name: 'auth',
    component: () => import( 'layouts/AuthLayout.vue' ),
    redirect: { name: 'auth.login' },
    children: [
      {
        path: 'login',
        name: 'auth.login',
        component: () => import( 'pages/auth/LoginPage.vue' )
      },
      {
        path: 'forgot-password',
        name: 'auth.forgot-password',
        component: () => import( 'pages/auth/ForgotPassword.vue' )
      },
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import( 'pages/ErrorNotFound.vue' )
  },
  {
    name: 'notAllowed',
    path: '/403',
    component: () => import( 'pages/ErrorNotAllowed.vue' )
  }
];

export default routes;
