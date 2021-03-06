import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      component: () => import(/* webpackChunkName: "editor" */ '@/components/Editor'),
      props: { advancedEditor: true },
    },
    {
      path: '/plain',
      component: () => import(/* webpackChunkName: "editor" */ '@/components/Editor'),
      props: { advancedEditor: false },
    },
  ],
});
