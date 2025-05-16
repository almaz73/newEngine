export const inspectionItemCategoryWithIndex = {
    10: {id: 30, name: 'Внеш. Осмотр кузова'},
    20: {id: 40, name: 'Внутренний осмотр'},
    30: {id: 20, name: 'Комплектация'},
    40: {id: 50, name: 'Под капотом'},
    50: {id: 60, name: 'Тест-драйв'},
    60: {id: 70, name: 'Подъёмник'},
    70: {id: 10, name: 'Комплектность'},
    80: {id: 80, name: 'Прочие работы'},
    90: {id: 90, name: 'Юридическая проверка'},
}

export const Months = {
    0: 'Январь',
    1: 'Февраль',
    2: 'Март',
    3: 'Апрель',
    4: 'Май',
    5: 'Июнь',
    6: 'Июль',
    7: 'Август',
    8: 'Сентябрь',
    9: 'Октябрь',
    10: 'Ноябрь',
    11: 'Декабрь',
}

export const DealSource = {
    10: 'Call-центр',
    20: 'Отдел продаж',
    30: 'Интернет',
    40: 'Партнер',
    50: 'Рекомендация',
    60: 'Отдел закупок',
    70: 'Внутреннее перемещение',
}

export const DealStatusTableEnum = {
    negative: 8,
    newDeal: 10,
    startWorking: 11,
    meeting: 12,
    testDrive: 13,
    contract: 14,
    recommendation: 15,
    archiveRequest: 16,
    archive: 17,
    appealReserveRequest: 18,
    inspection: 20,
    requestFromAnalyst: 23,
    storing: 25,
    returned: 28,
    analyticRequest: 30,
    analyticResponse: 40,
    requestFromBuyerManager: 45,
    approvedPrices: 50,
    approved: 60,
    declined: 70,
    withdraw: 75,
    formalization: 77,
    bought: 80,
    transit: 90,
    PSMEntrance: 100,
    PSMWash: 101,
    PSMWork: 102,
    PSMSendToSTO: 103,
    PSMSendToCC: 104,
    PSMServiceWorkCompleted: 105,
    PSMOnWork: 106,
    PSMAdditionalEquipment: 107,
    PSMWorkCompleted: 108,
    PSMCommissioning: 109,
    PSMToInspection: 110,
    PSMReserveRequest: 111,
    STOEntrance: 149,
    stoWait: 150,
    stoOnWork: 160,
    stoBodyWork: 170,
    stoWaitSparePart: 175,
    stoApproving: 180,
    outstandingCustomer: 185,
    discussionCompleteClientApproved: 261,
    discussionCompleteClientDeclined: 262,
    onCommission: 263,
    OnBuy: 264,
    OnTradeIn: 265,
    SellPhotoSession: 300,
    SellPriceDiscuss: 310,
    SellPerforming: 320,
    SellInReserve: 330,
    SellOnSale: 340,
    SellReserveRequest: 350,
    SellSold: 360,
    AppealFormalization: 400,
}

export const EventSearchCategory = {
    Today: 10,
    Expired: 20,
    All: 30,
}

export const Status= {
    //[Description("Не указано")]
    Default: 0,
        //[Description("Первичный")]
        FirstAppeal: 10,
        //[Description("Новый. По рекомендации")]
        ByRecommendation: 20,
        //[Description("Внешний клиент")]
        Foreign: 30,
        //[Description("Повторный")]
        Repeated: 40,
        //[Description("Вернувшийся")]
        Returned: 50,
        //[Description("Сирота")]
        Orphan: 60,
        //[Description("Упущенный клиент")]
        Losted: 70,
        //[Description("Клиент автосервиса")]
        AutoService: 80,
        //[Description("Визит по звонку")]
        CalledBefore: 100,
        //[Description("Забытый")]
        Forgotten: 110,
}