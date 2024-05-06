import {useGlobalStore} from "@/stores/globalStore";


let role = ''

export function permit(node, moduleName = null) {
    role = role || useGlobalStore().account.role
    if (role === 'Admin') return true

    switch (moduleName) {
        case null:
        case undefined:
            return node && leftPanelPermissions[node] && leftPanelPermissions[node].includes(role)
        case 'reports':
            return node && reportPermissions[node] && reportPermissions[node].includes(role)
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
        'Hostess',
        'CallEmployee'
    ],
    rDays: [
        'Admin',
        'CallManager',
        'LocalCallEmployee',
        'LocalCallManager',
        'Hostess',
        'CallEmployee'
    ],
    rArchive: [
        'Admin',
        'CallManager',
        'Hostess'
    ],
    rCalls: [
        'Admin',
        'CallManager',
        'Hostess'
    ],
    rBuyout: [
        'Admin',
        'CallManager',
        'Hostess'
    ],
    rAсtual: [
        'Admin',
        'CallManager',
        'LocalCallEmployee',
        'LocalCallManager',
        'Hostess',
        'CallEmployee'
    ]
}


