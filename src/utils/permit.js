import {useGlobalStore} from "@/stores/globalStore";


let role = ''

export function permit( moduleName = null, node) {
    role = role || useGlobalStore().account.role
    if (role === 'Admin') return true

    switch (moduleName) {
        case null:
        case undefined:
        case 'menu':
            return node && leftPanelPermissions[node] && leftPanelPermissions[node].includes(role)
        case 'reports':
            return node && reportPermissions[node] && reportPermissions[node].includes(role)
        case 'reportTabs':
            return node && reportTabs[node] && reportTabs[node].includes(role)
    }

}


const leftPanelPermissions = {
    desktop: [
        'Admin',
        'CallManager',
        'GenManager',
        'LocalCallEmployee',
        'LocalCallManager',
        'Hostess',
        'AnalystEmployee',
        'BuyerManager',
        'CallEmployee'
    ],
    appeal: [
        'Admin',
        'CallManager',
        'GenManager',
        'LocalCallEmployee',
        'LocalCallManager',
        'Hostess',
        'BuyerManager',
        'CallEmployee'
    ],
    deal: [
        'Admin',
        'GenManager',
        'BuyerManager'
    ],
    sell: [
        'Admin',
        'GenManager',
        'Hostess',
        'PsmManager'
    ],
    calendar: [
        'Admin',
        'CallManager',
        'GenManager',
        'LocalCallEmployee',
        'LocalCallManager',
        'Hostess',
        'AnalystEmployee',
        'BuyerManager',
        'CallEmployee'
    ],
    calls: [
        'Admin'
    ],
    reports: [
        'Admin',
        'CallManager',
        'LocalCallEmployee',
        'LocalCallManager',
        'Hostess',
        'AnalystEmployee',
        'BuyerManager',
        'CallEmployee'
    ],
    importExport: [
        'Admin',
        'BuyerManager'
    ],
    admin: [
        'Admin',
        'GenManager'
    ],
    plan: [
        'Admin',
        'BuyerManager'
    ],
    map: [
        'Admin'
    ],
    realization: [
        'Admin',
        'GenManager'
    ],
}
const reportPermissions = {
    rEmployees: [
        'Admin',
        'CallManager',
        'LocalCallEmployee',
        'LocalCallManager',
        'CallEmployee'
    ],
    rDays: [
        'Admin',
        'CallManager',
        'LocalCallEmployee',
        'LocalCallManager',
        'CallEmployee'
    ],
    rArchive: [
        'Admin',
        'CallManager',
    ],
    rCalls: [
        'Admin',
        'CallManager',
    ],
    rBuyout: [
        'Admin',
        'CallManager',
    ],
    rAсtual: [
        'Admin',
        'CallManager',
        'LocalCallEmployee',
        'LocalCallManager',
        'CallEmployee'
    ]
}
const reportTabs = {
    reportCommon: [
        'Admin',
        'LocalCallEmployee',
        'LocalCallManager',
    ],
    reportCallCenter: [
        'Admin',
        'LocalCallEmployee',
        'LocalCallManager',
        'CallManager',
        'CallEmployee',
        'Hostess',
    ],
    reportAnalitic: [
        'Admin',
        'LocalCallEmployee',
        'LocalCallManager',
    ],
    reportSell: [
        'Admin',
        'LocalCallEmployee',
        'LocalCallManager',
    ],
    reportAutoSet: [
        'Admin',
        'LocalCallEmployee',
        'LocalCallManager'
    ]
}

