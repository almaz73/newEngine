import {createRouter, createWebHistory} from 'vue-router'
import LoginPage from '@/pages/LoginPage.vue'
import IntrodusionPage from "@/pages/IntrodusionPage.vue";
import {ElMessage} from "element-plus";

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
            component: () => import('@/desktop/DeskTopPage.vue').catch(val => fail(val))
        }, {
            path: '/example',
            name: 'example',
            component: () => import('@/desktop/ExampleForm.vue').catch(val => fail(val))
        },{
            path: '/appeal',
            name: 'appeal',
            component: () => import('@/pages/appeal/AppealPage.vue').catch(val => fail(val))
        }, {
            path: '/deal',
            name: 'deal',
            component: () => import('@/pages/deal/DealPage.vue').catch(val => fail(val))
        }, {
            path: '/sell',
            name: 'sell',
            component: () => import('@/pages/warehous/WarehousPage.vue').catch(val => fail(val))
        }, {
            path: '/realization',
            name: 'realization',
            component: () => import('@/pages/realization/RealizationPage.vue').catch(val => fail(val))
        }, {
            path: '/ideas',
            name: 'ideas',
            component: () => import('../views_Developer/IdeaPage.vue').catch(val => fail(val))
        }, {
            path: '/bayerhelp',
            name: 'bayerhelp',
            component: () => import('../documentation/bayerhelp.vue').catch(val => fail(val))
        }, {
            path: '/calls',
            name: 'calls',
            component: () => import('@/pages/calls/CallsPage.vue').catch(val => fail(val))
        }, {
            path: "/:catchAll(.*)",
            component: () => import('@/components/NoPage.vue')
        },
    ]
})

function fail(val: any) {
    if (val.toString().includes('Failed to fetch') && !navigator.onLine) {
        ElMessage({message: 'Страница недоступна, сайт работает офлайн!', type: 'warning',})
    }

}

export default router
