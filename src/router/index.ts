import {createRouter, createWebHistory} from 'vue-router'
import LoginPage from '@/pages/LoginPage.vue'
import IntrodusionPage from "@/pages/IntrodusionPage.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: IntrodusionPage
        }, {
            path: '/login',
            name: 'login',
            component: LoginPage
        }, {
            path: '/desktop',
            name: 'desktop',
            component: () => import('@/pages/DeskTopPage.vue')
        }, {
            path: '/appeal',
            name: 'appeal',
            component: () => import('@/pages/appeal/AppealPage.vue')
        }, {
            path: '/deal',
            name: 'deal',
            component: () => import('@/pages/deal/DealPage.vue')
        }, {
            path: '/sell',
            name: 'sell',
            component: () => import('@/pages/warehous/WarehousPage.vue')
        }, {
            path: '/realization',
            name: 'realization',
            component: () => import('@/pages/realization/RealizationPage.vue')
        }, {
            path: '/ideas',
            name: 'ideas',
            component: () => import('../views_Developer/IdeaPage.vue')
        }, {
            path: '/bayerhelp',
            name: 'bayerhelp',
            component: () => import('../documentation/bayerhelp.vue')
        }, {
            path: '/calls',
            name: 'calls',
            component: () => import('@/pages/calls/CallsPage.vue')
        }
    ]
})

export default router
