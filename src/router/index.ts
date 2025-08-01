import {createRouter, createWebHistory} from 'vue-router'
import LoginPage from '@/pages/LoginPage.vue'
import IntrodusionPage from "@/pages/IntrodusionPage.vue";
import {ElMessage} from "element-plus";
import VersionPage from "@/pages/VersionPage.vue";
import {startCounter} from "@/utils/counterPageViews"

const router = createRouter({
    history: createWebHistory('/v2/'),
    routes: [
        {
            path: '/',
            name: 'home',
            component: IntrodusionPage
        }, {
            path: '/sets',
            name: 'sets',
            component: IntrodusionPage
        },{
            path: '/login',
            name: 'login',
            component: LoginPage
        }, {
            path: '/version',
            name: 'version',
            component: VersionPage
        }, {
            path: '/undercontruction',
            name: 'undercontruction',
            component: () => import('@/pages/UnderConstructionPage.vue').catch(val => fail(val))
        }, {
            path: '/desktop',
            name: 'desktop',
            component: () => import('@/pages/desktop/DeskTop.vue').catch(val => fail(val))
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
            path: '/appeal/commission/:id',
            name: 'comiisionEdit',
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
            path: '/realizations',
            name: 'realizations',
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
            path: '/auto/:autoId/deal/:dealId/inspection',
            name: 'inspectionList',
            component: () => import('@/pages/deal/tabs/collapses/C_InspectionList.vue').catch(val => fail(val))
        }, {
            path: '/auto/:autoId/deal/:dealId/inspection/:inspectionId/edit-category/:categoryId',
            name: 'editInspection',
            component: () => import('@/pages/deal/tabs/collapses/inspectionList/AllInspections.vue').catch(val => fail(val))
        }, {
            path: '/auto/:autoId/deal/:dealId/inspections/:inspectionId/plainwork',
            name: 'editPlannedWork',
            component: () => import('@/pages/deal/tabs/collapses/inspectionList/PlannedWorkEdit.vue').catch(val => fail(val))
        }, {
            path: '/deal/:dealId/servicework',
            name: 'editServiceWorks',
            component: () => import('@/pages/deal/tabs/collapses/inspectionList/ServiceWorks.vue').catch(val => fail(val))
        }, { path: '/showcase',
            name: 'showcase',
            component: () => import('@/pages/showcase/ShowCasePage.vue').catch(val => fail(val))
        }, {
            path: "/:catchAll(.*)",
            component: () => import('@/components/NoPage.vue')
        },

    ]
})

function reloadPage() {
    // исправление проблемы роутера - иногда не переходит на нужную страницу
    console.log("%c ... force обновление страницы ", "color: blue; background: red");
    if (localStorage.getItem('isRouteGluk')!=='true')  location.reload();
    localStorage.setItem('isRouteGluk', 'true') // для выхода из бесконечного цикла
}

router.beforeEach((res, from, next) => {
    let startLength = document.body.textContent?.length

    setTimeout(() => {
        let endLength = document.body.textContent?.length
        if (startLength === endLength) reloadPage()
        else localStorage.removeItem('isRouteGluk')
    }, 1000)

    if (res.fullPath === '/appeal/showcase') router.push('/showcase')
    else next()

    startCounter(res.fullPath, Date.now())
})

router.afterEach((to) => {
    let acceptedPaths = [
      '/undercontruction',
      '/reports',
      '/login',
      '/admin',
      '/desktop',
      '/calendar',
      '/appeal',
      '/appeal/commission',
      '/feedback',
      '/version',
      '/sets',
      '/showcase'
    ]


    if (location.hostname === 'live.autonet.pro') {
    // if (location.hostname === "localhost") {
        let part = to.path
        if (to.path.split('/').length > 2) part = to.path.slice(0, to.path.lastIndexOf('/'))

        let door = acceptedPaths.includes(part)
        // if (!door) router.push(`/undercontruction`)

        if (!door) {
            router.push(`/desktop`)
            ElMessage({message: 'Доступ к разделу закрыт!', type: 'warning',})
        }
    }
    window.scrollTo({top: 0}) // прокручиваю наверх
})

function fail(val: any) {
    if (val.toString().includes('Failed to fetch') && !navigator.onLine) {
        ElMessage({message: 'Страница недоступна, сайт работает офлайн!', type: 'warning',})
    }

}

export default router

