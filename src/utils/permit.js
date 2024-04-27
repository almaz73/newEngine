import {useGlobalStore} from "@/stores/globalStore";


let role = ''

export function permit(node, moduleName=null) {
    role = role || useGlobalStore().account.role
    if (role === 'Admin') return true

    switch (moduleName) {
        case undefined:
            return node && leftPanelPermissions[node] && leftPanelPermissions[node].includes(role)
        case 'reports':
            return node && repoerPermissions[node] && repoerPermissions[node].includes(role)
    }

}


const leftPanelPermissions = {
    desktop: [
        'Admin',
        'CallManager',
        'GenManager',
        'LocalCallEmployee',
        'Hostess',
        'AnalystEmployee',
        'BuyerManager'
    ],
    appeal: [
        'Admin',
        'CallManager',
        'GenManager',
        'LocalCallEmployee',
        'Hostess',
        'BuyerManager'
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
        'Hostess',
        'AnalystEmployee',
        'BuyerManager'
    ],
    calls: [
        'Admin'
    ],
    reports: [
        'Admin',
        'CallManager',
        'LocalCallEmployee',
        'Hostess',
        'AnalystEmployee',
        'BuyerManager'
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
const repoerPermissions = {
    rEmployees: [
        'Admin',
        'CallManager',
        'LocalCallEmployee'
    ],
    rDays: [
        'Admin',
        'CallManager',
        'LocalCallEmployee'
    ],
    rArchive: [
        'Admin',
        'CallManager'
    ],
    rCalls: [
        'Admin',
        'CallManager',
    ],
    rBuyout: [
        'Admin',
        'CallManager'
    ],
    rAсtual: [
        'Admin',
        'CallManager',
        'LocalCallEmployee'
    ]
}


