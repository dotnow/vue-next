import { createRouter, createWebHistory } from 'vue-router'
import { authService } from '@/plugins/firebase'
import Shop from '@/views/Shop'
import Auth from '@/views/Auth'

const APP_NAME = process.env.VUE_APP_NAME ?? 'Vladilen Online'

const requireAuth = (_, from, next) => {
  let user = authService.currentUser
  if (!user) {
    next({ name: 'auth' })
  } else {
    next()
  }
}

const routes = [
  {
    path: '/',
    name: 'shop',
    component: Shop,
    props: route => ({
      name: route.query.name,
      categoryID: route.query.categoryID
    }),
    meta: {
      layout: 'main',
      title: 'Главная'
    }
  },
  {
    path: '/product/:id',
    name: 'product',
    params: true,
    component: () => import('@/views/Product'),
    meta: {
      layout: 'main',
      title: 'Просмотр товара'
    }
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('@/views/Cart'),
    meta: {
      layout: 'main',
      title: 'Корзина'
    }
  },
  {
    path: '/auth',
    name: 'auth',
    component: Auth,
    meta: {
      layout: 'clean',
      title: 'Авторизация'
    }
  },
  {
    path: '/admin',
    name: 'admin',
    redirect: '/admin/products',
    component: () => import('@/views/admin/Index'),
    beforeEnter: requireAuth,
    meta: {
      layout: 'main',
      title: 'Панель администратора'
    },
    children: [
      {
        path: 'products',
        name: 'admin-products',
        component: () => import('@/views/admin/Products')
      },
      {
        path: 'categories',
        name: 'admin-categories',
        component: () => import('@/views/admin/Categories')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const title = to.meta.title

  if (title) {
    document.title = APP_NAME + ' | ' + title
  } else {
    document.title = APP_NAME
  }

  next()
})

export default router
