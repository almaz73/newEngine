import {useGlobalStore} from "@/stores/globalStore";


let role = ''

export function permit(node, moduleName) {
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
        'PsmManager',
        'Hostess'

    ],
    appeal: [
        'Admin',
        'CallManager',
        'GenManager',
        'LocalCallEmployee',
        'Hostess'
    ],
    deal: [
        'Admin',
        'GenManager',
        'Hostess'
    ],
    sell: [
        'Admin',
        'GenManager',
        'Hostess'
    ],
    calendar: [
        'Admin',
        'CallManager',
        'GenManager',
        'LocalCallEmployee',
        'Hostess'
    ],
    calls: [
        'Admin'
    ],
    reports: [
        'Admin',
        'CallManager',
        'LocalCallEmployee',
        'Hostess'
    ],
    admin: [
        'Admin',
        'GenManager'
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


