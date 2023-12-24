import {createRouter, createWebHistory} from 'vue-router'
import LoginPage from '@/pages/LoginPage.vue'
import HomeView from "@/pages/HomeView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/login',
            name: 'login',
            component: LoginPage
        },
        {
            path: '/appeal',
            name: 'appeal',
            component: () => import('@/pages/appeal/AppealPage.vue')
        },
        {
            path: '/desktop',
            name: 'desktop',
            component: () => import('@/pages/DeskTopPage.vue')
        },
        {
            path: '/deal',
            name: 'deal',
            component: () => import('@/pages/deal/DealPage.vue')
        },
        {
            path: '/help',
            name: 'help',
            component: () => import('@/pages/HelpPage.vue')
        },
        {
            path: '/ideas',
            name: 'ideas',
            component: () => import('../views_Developer/IdeaPage.vue')
        },
        {
            path: '/bayerhelp',
            name: 'bayerhelp',
            component: () => import('../documentation/bayerhelp.vue')
        }
    ]
})

export default router
