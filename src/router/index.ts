import ApiView from '@/views/ApiView.vue';
import HomeView from '@/views/HomeView.vue';
import InterfaceView from '@/views/InterfaceView.vue';
import translate from '@/translate';
import { createRouter, createWebHistory } from 'vue-router';

const t = translate.global.t;

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: getTitle(`${t('mainTitle')}`) },
    },
    {
      path: '/interface',
      name: 'interface',
      component: InterfaceView,
      meta: { title: getTitle(`${t('interfaceTitle')}`) },
    },
    {
      path: '/api',
      name: 'api',
      component: ApiView,
      meta: { title: getTitle(`${t('apiTitle')}`) },
    },
    {
      path: '/:catchAll(.*)',
      name: 'not-found',
      component: () => import('../views/ModelView.vue'),
      meta: { title: getTitle('Not found') },
    },
  ],
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

export default router;

interface RouteMeta {
  title?: string;
}

router.beforeEach((to, _from, next) => {
  const meta = to.meta as RouteMeta;
  if (meta && meta.title) {
    document.title = meta.title;
  } else {
    document.title = getTitle();
  }
  next();
});

function getTitle(title?: string): string {
  return `Browse Buddy - ${title}`;
}
