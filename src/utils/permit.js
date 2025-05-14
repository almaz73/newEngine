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
        case 'inspectionPhoto':
          return inspectionPhoto.includes(role)
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
        'BuyerEmployee',
        'CallEmployee',
        'SalesEmployee',
        'SalesManager'
    ],
    appeal: [
        'Admin',
        'CallManager',
        'GenManager',
        'LocalCallEmployee',
        'LocalCallManager',
        'Hostess',
        'BuyerManager',
        'BuyerEmployee',
        'CallEmployee',
        'Agent',
        'SalesEmployee',
        'SalesManager'
    ],
    deal: [
        'Admin',
        'GenManager',
        'BuyerManager',
        'BuyerEmployee',
        'Agent',
        'AnalystManager'
    ],
    sell: [
        'Admin',
        'GenManager',
        'Hostess',
        'PsmManager',
        'BuyerEmployee',
        'Agent',
        'SalesEmployee',
        'SalesManager'
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
        'CallEmployee',
        'BuyerEmployee',
        'Agent',
        'AnalystManager'
    ],
    calls: [
        'Admin',
        'BuyerEmployee',
    ],
    reports: [
        'Admin',
        'CallManager',
        'LocalCallEmployee',
        'LocalCallManager',
        'Hostess',
        'AnalystEmployee',
        'BuyerManager',
        'CallEmployee',
        'BuyerEmployee',
        'SalesEmployee',
        'SalesManager',
        'AnalystManager'
    ],
    importExport: [
        'Admin',
        'BuyerManager'
    ],
    admin: [
        'Admin',
        'GenManager',
        'BuyerEmployee',
    ],
    plan: [
        'Admin',
        'BuyerManager',
        'BuyerEmployee',
    ],
    map: [
        'Admin'
    ],
    realization: [
        'Admin',
        'GenManager'
    ],
    showcase: [
        'CallManager'
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
    rActual: [
        'Admin',
        'CallManager',
        'LocalCallEmployee',
        'LocalCallManager',
        'CallEmployee'
    ],
    rOverDue: [
        'Admin',
        'CallManager',
        'LocalCallEmployee',
        'LocalCallManager'
    ],
    rCountEmployers:[
        'BuyerEmployee',
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
    ],
    reportBayer: [
        'BuyerEmployee'
    ],

}

const inspectionPhoto = [
    'BuyerEmployee',
    'BuyerManager',
    'GenManager',
    'RegionManager',
    'AnalystEmployee',
    'AnalystManager',
    'STOManager',
    'STODispatcher',
    'Photographer',
    'Agent',
    'GenDirector',
    'KSOEmployee',
    'KSOManager',
    'PsmManager'
]

