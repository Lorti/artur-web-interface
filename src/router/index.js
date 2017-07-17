import Vue from 'vue';
import Router from 'vue-router';
import Label from '@/components/Label';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Label',
      component: Label,
    },
  ],
});
