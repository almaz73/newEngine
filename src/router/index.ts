import {createRouter, createWebHistory} from 'vue-router'
import LoginPage from '@/pages/LoginPage.vue'
import IntrodusionPage from "@/pages/IntrodusionPage.vue";
import {ElMessage} from "element-plus";
import VersionPage from "@/pages/VersionPage.vue";

const router = createRouter({
    history: createWebHistory('/v2/'),
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
            path: '/version',
            name: 'version',
            component: VersionPage
        }, {
            path: '/desktop',
            name: 'desktop',
            component: () => import('@/pages/desktop/DeskTopPage.vue').catch(val => fail(val))
        }, {
            path: '/hostess',
            name: 'hostess',
            component: () => import('@/pages/desktop/HostesPage.vue').catch(val => fail(val))
        }, {
            path: '/example',
            name: 'example',
            component: () => import('@/pages/desktop/ExampleForm.vue').catch(val => fail(val))
        }, {
            path: '/appeal',
            name: 'appeal',
            component: () => import('@/pages/appeal/AppealPage.vue').catch(val => fail(val))
        },
        {
            path: '/appeal/:id',
            name: 'appealEdit',
            props: true,
            component: () => import('@/pages/appeal/AppealEditor.vue').catch(val => fail(val))
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
            component: () => import('@/views_Developer/IdeaPage.vue').catch(val => fail(val))
        }, {
            path: '/myView',
            name: 'myView',
            component: () => import('@/myView/MyView.vue').catch(val => fail(val))
        }, {
            path: '/bayerhelp',
            name: 'bayerhelp',
            component: () => import('@/documentation/BayerHelp.vue').catch(val => fail(val))
        }, {
            path: '/admin',
            name: 'admin',
            component: () => import('@/pages/admin/AdminPage.vue').catch(val => fail(val))
        }, {
            path: '/calendar',
            name: 'calendar',
            component: () => import('@/pages/calendar/CalendarPage.vue').catch(val => fail(val))
        }, {
            path: '/map',
            name: 'map',
            component: () => import('@/components/MapCtrl.vue').catch(val => fail(val))
        }, {
            path: '/feedback',
            name: 'feedback',
            component: () => import('@/pages/feedback/FeedBackPage.vue').catch(val => fail(val))
        }, {
            path: '/reports',
            name: 'reports',
            component: () => import('@/pages/report/ReportPage.vue').catch(val => fail(val))
        }, {
            path: '/auto/deal/add/clientId/:clientId/parentId/:parentId',
            name: 'addDeal',
            component: () => import('@/pages/appeal/appealEditFields/CarEditor.vue').catch(val => fail(val))
        }, {
            path: '/auto/:autoId/edit/:dealId',
            name: 'editPageDeal',
            component: () => import('@/pages/deal/tabs/CarEditor.vue').catch(val => fail(val))
        }, {
            path: '/auto/:id/deal/:appealId',
            name: 'editDeal',
            component: () => import('@/pages/deal/DealEditor.vue').catch(val => fail(val))
        }, {
            path: '/client/legal/add',
            name: 'clientType',
            component: () => import('@/components/TypeClientEdit.vue').catch(val => fail(val))
        }, {
            path: '/auto/:autoId/deal/:dealId/inspection/:inspectionId/edit-category/:categoryId',
            name: 'editInspection',
            component: () => import('@/pages/deal/tabs/collapses/inspectionList/AllInspections.vue').catch(val => fail(val))
        }, {
            path: '/auto/:autoId/deal/:dealId/inspections/:inspectionId/plainwork',
            name: 'editPlannedWork',
            component: () => import('@/pages/deal/tabs/collapses/inspectionList/PlannedWorkAlone.vue').catch(val => fail(val))
        }, {
            path: '/deal/:dealId/servicework',
            name: 'editServiceWorks',
            component: () => import('@/pages/deal/tabs/collapses/inspectionList/IServiceWorks.vue').catch(val => fail(val))
        }, {
            path: "/:catchAll(.*)",
            component: () => import('@/components/NoPage.vue')
        },

    ]
})

router.beforeEach(res=>{
    // console.log('???Меняется мгу3 router4=',res)
})

function fail(val: any) {
    if (val.toString().includes('Failed to fetch') && !navigator.onLine) {
        ElMessage({message: 'Страница недоступна, сайт работает офлайн!', type: 'warning',})
    }

}

export default router
