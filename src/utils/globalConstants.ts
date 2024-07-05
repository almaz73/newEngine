export const widthMobile = 500;

export const LeadType = [
    {id: 10, name: 'Физ. лицо'},
    {id: 20, name: 'Юр. лицо'}
]
export const driveTypies = [
    {id: 10, name: 'Передний привод'},
    {id: 20, name: 'Задний привод'},
    {id: 30, name: 'Полный привод'}
]
export const kpp = [
    {id: 10, name: 'Механическая'},
    {id: 20, name: 'Автоматическая'},
    {id: 30, name: 'Вариатор'},
    {id: 40, name: 'Роботизированная'}
]
export const buyTypes = [ //DealType
    {id: 10, name: 'Комиссия'},
    {id: 20, name: 'Trade-in'},
    {id: 30, name: 'Корпоративная комиссия'},
    {id: 40, name: 'Выкуп у физ. лица'},
    {id: 50, name: 'Выкуп у юр. лица'},
    {id: 60, name: 'A/м через салон'},
    {id: 70, name: 'Хранение'},
]
export const bodyTypes = [
    {id: 1, name: 'Хэтчбэк'},
    {id: 2, name: 'Седан'},
    {id: 3, name: 'Универсал'},
    {id: 4, name: 'Минивен'},
    {id: 5, name: 'Кабриолет'},
    {id: 6, name: 'Кроссовер'},
    {id: 7, name: 'Пикап'},
    {id: 8, name: 'Лифтбэк'},
    {id: 9, name: 'Автобус'},
    {id: 10, name: 'Купе'},
    {id: 11, name: 'Внедорожник'}
]
export const statuses = [
    {id: 8, name: 'Отказ'},
    {id: 10, name: 'Новый'},
    {id: 11, name: 'В работе'},
    {id: 12, name: 'Встреча'},
    {id: 13, name: 'Тест-драйв'},
    {id: 14, name: 'Контракт'},
    {id: 15, name: 'Рекомендация'},
    {id: 16, name: 'Запрос в архив'},
    {id: 17, name: 'Архив'},
    {id: 18, name: 'Обращение. Запрос бронирования'},
    {id: 20, name: 'Осмотр'},
    {id: 23, name: 'Запрос от аналитика'},
    {id: 25, name: 'Хранение'},
    {id: 28, name: 'Возвращен'},
    {id: 30, name: 'Запрос цены в аналитический центр'},
    {id: 40, name: 'Аналитик согласовал цену'},
    {id: 45, name: 'Запрос от руководителя'},
    {id: 50, name: 'Ожидает подтверждения выкупа'},
    {id: 60, name: 'Заявка одобрена'},
    {id: 70, name: 'Заявка отклонена'},
    {id: 75, name: 'Заявка отозвана по требованию клиента'},
    {id: 76, name: 'Проведение аукциона'},
    {id: 77, name: 'Оформление выкупа'},
    {id: 80, name: 'Автомобиль выкуплен'},
    {id: 90, name: 'Транзит'},
    {id: 100, name: 'ПСО. Поступление'},
    {id: 101, name: 'ПСО. Мойка'},
    {id: 102, name: 'ПСО. В работе'},
    {id: 103, name: 'ПСО. Отправить в СТО'},
    {id: 104, name: 'ПСО. Отправить в КЦ'},
    {id: 105, name: 'ПСО. Сервисные работы завершены'},
    {id: 106, name: 'ПСО. В работу'},
    {id: 107, name: 'ПСО. Дополнительное оборудование'},
    {id: 108, name: 'ПСО. Работы завершены'},
    {id: 109, name: 'ПСО. На сдачу'},
    {id: 110, name: 'ПСО. Осмотр'},
    {id: 111, name: 'ПСО. Запрос бронирования'},
    {id: 149, name: 'СТО. Поступление'},
    {id: 150, name: 'Ожидание работы СТО'},
    {id: 160, name: 'В работе СТО'},
    {id: 170, name: 'Кузовные работы СТО'},
    {id: 175, name: 'Ожидает зап часть СТО'},
    {id: 180, name: 'СТО выполнены'},
    {id: 185, name: 'Выдана клиенту'},
    {id: 261, name: 'Переговоры завершены, клиент согласен'},
    {id: 262, name: 'Переговоры завершены, клиент не согласен'},
    {id: 300, name: 'Фотосессия'},
    {id: 310, name: 'Ценообразование'},
    {id: 320, name: 'Оформление'},
    {id: 330, name: 'В резерве'},
    {id: 340, name: 'На продаже'},
    {id: 350, name: 'Продажа. Запрос бронирования'},
    {id: 360, name: 'Продан'},
    {id: 361, name: 'Возвращена клиенту'},
    {id: 362, name: 'Транзит'},
    {id: 400, name: 'Оформление'}
]

export const appealStatus = [
    {name: 'Обращения', tyoe: 'Appeals', id: 10},
    {name: 'События на сегодня', tyoe: 'Today', id: 20},
    {name: 'Просроченные события', tyoe: 'Expired', id: 30},
    {name: 'Запрос в архив', tyoe: 'ArchiveRequest', id: 50}
]

export const categoryAutos = [
    {id: 1, name: 'A'},
    {id: 2, name: 'B'},
    {id: 3, name: 'C'},
    {id: 4, name: 'D'},
    {id: 5, name: 'S'},
]

export const Workflows = [
    {id: 1, value: 1, title: 'Продажа'},
    {id: 2, value: 2, title: 'Выкуп'},
    {id: 3, value: 3, title: 'Сервис'},
    {id: 4, value: 4, title: 'КСО'},
    {id: 5, value: 5, title: 'Fleet'},
    {id: 6, value: 6, title: 'Франшиза'},
    {id: 7, value: 7, title: 'Доп.оборуд.'},
    {id: 8, value: 8, title: 'Комиссия'},
    {id: 9, value: 9, title: 'Подбор авто'},
    {id: 10, value: 10, title: 'Сделка через салон'},
    {id: 11, value: 11, title: 'Трейд-ин'},
    {id: 12, value: 12, title: 'Поддержание контакта'},
    {id: 13, value: 13, title: 'Претензии'}
]

export const WorkflowsVariants = {
    Buyers: {
        2: 'Выкуп',
        3: 'Сервис',
        7: 'Доп.оборуд.',
        8: 'Комиссия',
        11: 'Трейд-ин',
    },
    Sell: {
        1: 'Продажа',
        8: 'Комиссия',
        9: 'Подбор авто',
        10: 'Сделка через салон',
    },
    GenManager: {
        1: 'Продажа',
        2: 'Выкуп',
        3: 'Сервис',
        7: 'Доп.оборуд.',
        8: 'Комиссия',
        10: 'Сделка через салон',
    },
    Other: {
        6: 'Франшиза',
    },
    AllUsers: {
        1: 'Продажа',
        2: 'Выкуп',
        3: 'Сервис',
        4: 'КСО',
        5: 'Fleet',
        6: 'Франшиза',
        7: 'Доп.оборуд.',
        8: 'Комиссия',
        9: 'Подбор авто',
        10: 'Сделка через салон',
    }
}
// export const WorkflowStatus = {
//     8: 'Отказ',
//     10: 'Новый',
//     11: 'В работе',
//     12: 'Встреча',
//     13: 'Тест-драйв',
//     14: 'Контракт',
//     15: 'Рекомендация',
//     16: 'Запрос в архив',
//     17: 'Архив',
//     18: 'Запрос бронирования',
//     360: 'Продан',
//     400: 'Оформление',
// }

export const AppealStatusTable = [
    {id: 0, name: 'Новый'},
    {id: 8, name: 'Обращение. Отказ'},
    {id: 11, name: 'Обращение. В работу'},
    {id: 14, name: 'Обращение. Контракт'},
    {id: 16, name: 'Обращение. Запрос архивирования'},
    {id: 17, name: 'Обращение. Архивировать'},

    {id: 100, name: 'ПСО. Поступление'},
    //{id: 100, name: 'Продажа. Отправить в ПСО'}, ????
    {id: 104, name: 'Продажа. Отправить в КЦ'},
    {id: 149, name: 'Продажа. Отправить в СТО'},

    {id: 263, name: 'Передать на комиссию'},
    {id: 264, name: 'Передать на выкуп'},
    {id: 265, name: 'Передать на Трейд-ин'},

    {id: 300, name: 'Продажа. Фотосессия'},
    {id: 310, name: 'Продажа. Установить цену'},
    {id: 320, name: 'Продажа. Оформление'},
    {id: 330, name: 'Продажа. В резерв'},
    {id: 340, name: 'Продажа. На продажу'},
    // {id: 340, name: 'Создание обращения с типом "Продажа"'},
    // {id: 340, name: 'ПСО. Запрос бронирования'},
    {id: 350, name: 'Продажа. Запрос бронирования'},
    {id: 360, name: 'Продажа. Продано'},

    {id: 400, name: 'Обращение. Оформление'},
]

export const DealStatusTable = [
    {id: 20, name: 'Осмотр'},
    {id: 30, name: 'Подтверждение аналитика'},
    {id: 261, name: 'Переговоры завершены, клиент согласен'},
    {id: 262, name: 'Переговоры завершены, клиент не согласен'},
    {id: 75, name: 'Отказ со стороны клиента'},
    {id: 23, name: 'Уточнить данные'},
    {id: 70, name: 'Отказ со стороны АЦ'},
    // {id: , name: 'Установить цену'},
    // {id: , name: 'Установить цену новая'},
    {id: 73, name: 'Аналитик согласовал цену'},

    {id: 50, name: 'Запросить подтверждение выкупа'},
    {id: 45, name: 'Уточнить данные (у менеджера по зхакупкам)'},
    {id: 60, name: 'Подтвердить заявку'},
    {id: 77, name: 'Оформить выкуп'},
    {id: 80, name: 'Выкупить автомобиль'},

  // смотреть deal-general.tpl.html
    // ng-if="(currentUser.role=='Admin'?true: printForm.error == false)"
    // {id: 20, name: 'Выкупить автомобиль'},

  //ng-if="::checkStatus(dealStatusEnum.transit) && deal.dealStatus < dealStatusEnum.photoSession"
    {id: 90, name: 'Транзит'},
    {id: 150, name: 'Перевести в ожидание СТО'},

    {id: 160, name: 'Перевести в работу СТО'},
    {id: 170, name: 'Кузовные работы СТО'},
    {id: 175, name: 'Перевести в ожидание зап части'},
    {id: 180, name: 'Завершить работы СТО'},

  //ng-if="::checkStatus(dealStatusEnum.transit) && deal.dealStatus > dealStatusEnum.photoSession"
    {id: 90, name: 'Вернуть в сервис'},
    {id: 185, name: '"Выдать клиенту'},
    // {id: 20, name: 'Начать фотосессию'},
    // {id: 20, name: 'Закончить фотосессию'},
    // {id: 20, name: 'Выставить на продажу'},
    {id: 28, name: 'Вернуть клиенту'},

  //<li ng-if="::checkStatus(dealStatusEnum.analyticResponse) && deal.dealStatus == 80">
    {id: 40, name: 'Oтмена выкупа'},

  // <ul ng-if="deal.dealType == 30 && availableStatuses.length > 0">
    {id: 25, name: 'Перевести на хранение'},
    {id: 28, name: 'Возвратить авто'},
    // {id: 20, name: 'Выкупить а/м'}, ???? как у осмотра ID

    {id: 100, name: 'ПСО. Поступление'},
    {id: 101, name: 'ПСО. Мойка'},
    {id: 108, name: 'ПСО. В работе'},
    {id: 103, name: 'ПСО. Отправить в СТО'},
    {id: 104, name: 'ПСО. Отправить в КЦ'},
    {id: 105, name: 'ПСО. Сервисные работы завершены'},
    {id: 106, name: 'ПСО. В работу'},
    {id: 107, name: 'ПСО. Дополнительное оборудование'},
    {id: 108, name: 'ПСО. Работы завершены'},
    {id: 109, name: 'ПСО. На сдачу'},
    {id: 110, name: 'ПСО. Осмотр'},
    {id: 111, name: 'ПСО. Запрос бронирования'},

  //  <ul ng-if="availableStatuses.length > 0 && deal.type == 4">
    {id: 340, name: 'Продажа. На продажу'},
    {id: 300, name: 'Продажа. Фотосессия'},
    {id: 310, name: 'Продажа. Установить цену'},
    {id: 350, name: 'Продажа. Запрос бронирования'},

  //   <ul ng-if="availableStatuses.length > 0 && (deal.type == 1 || deal.type == 3)">
    //                                         <div user-permission="dealGeneral.sellStatusChange">
    {id: 149, name: 'Продажа. Отправить в СТО'},
  // <div user-permission="dealGeneral.sellStatusChange">
    {id: 100, name: 'Продажа. Отправить в ПСО'},

  //<div user-permission="dealGeneral.sellStatusChange">
    {id: 104, name: 'Продажа. Отправить в КЦ'},
    {id: 300, name: 'Продажа. Фотосессия'},
    {id: 340, name: 'Продажа. На продажу'},
    {id: 310, name: 'Продажа. Установить цену'},
    {id: 320, name: 'Продажа. Оформление'},
    {id: 350, name: 'Продажа. Запрос бронирования'},
    {id: 330, name: 'Продажа. В резерв'},
    {id: 360, name: 'Продажа. Продано'},

    //  ng-if="changeLocation.allow"
    // {id: 20, name: ' Перемещение а/м'},
    // <ul ng-if="show.sendForAuction">
    // {id: 20, name: 'Направить на аукцион'},
    {id: 20, name: 'Осмотр'},
    {id: 20, name: 'Осмотр'},
  ]

export const EventStatusEnums = {'Открыта': 10, 'В работе': 20, 'Закрыта': 30}
export const CommunicationTypes = [
    {id: 10, name: 'Входящий звонок'},
    {id: 15, name: 'Исходящий звонок'},
    {id: 20, name: 'Визит'},
    {id: 30, name: 'Заявка через интернет'}
]

export const Hostes = [
    { id: 2, value: 2, title: 'Продать а/м' },
    { id: 1, value: 1, title: 'Купить а/м' },
    { id: 8, value: 8, title: 'Оставить а/м на комиссию' },
    { id: 3, value: 3, title: 'Автосервис' },
    { id: 4, value: 4, title: 'Оформление кредита/страховки' },
    { id: 7, value: 7, title: 'Приобрести доп. оборудование' },
    { id: 9, value: 9, title: 'Подобрать автомобиль' },
    { id: 10, value: 10, title: 'Оформить сделку через салон' },
]

export const BuyCategoryTypes = [
    {id: 10, title: 'Свободный выкуп'},
    {id: 20, title: 'Выездной выкуп'},
    {id: 30, title: 'Регион'},
    {id: 40, title: 'Fleet'},
]

export const GearboxType = [
    {id: 10, name: 'Механическая'},
    {id: 20, name: 'Автоматическая'},
    {id: 30, name: 'Вариатор'},
    {id: 40, name: 'Роботизированная'}
]
export const EngineType = [
    {id: 10, name: 'Бензин'},
    {id: 20, name: 'Дизель'},
    {id: 30, name: 'Бензин/газ'},
    {id: 40, name: 'Гибрид'}
]

export const inspectionItemCategories = [
    {id: 30, name: 'Внеш. Осмотр кузова'},
    {id: 40, name: 'Внутренний осмотр'},
    {id: 20, name: 'Комплектация'},
    {id: 50, name: 'Под капотом'},
    {id: 60, name: 'Тест-драйв'},
    {id: 70, name: 'Подъёмник'},
    {id: 10, name: 'Комплектность'},
    {id: 80, name: 'Прочие работы'},
    {id: 90, name: 'Юридическая проверка'}
]

export const inspectionUiType = [
    {id: 10, name: 'IsStock'},
    {id: 20, name: 'IsRepaired'},
    {id: 30, name: 'IsNorm'},
    {id: 40, name: 'IsNecessary'},
]

export const WorkType = [
    {id: 10, name: 'ПСО'},
    {id: 20, name: 'СТО замена'},
    {id: 30, name: 'СТО ремонт'},
    {id: 40, name: 'СТО шиномонтаж'},
    {id: 50, name: 'СТОК'}
]

export const clientStatusEnums = [
    {id: 0, name: 'Не указано'},
    {id: 10, name: 'Первичный'},
    {id: 20, name: 'По рекомендации'},
    {id: 30, name: 'Внешний клиент'},
    {id: 40, name: 'Повторный'},
    {id: 50, name: 'Вернувшийся'},
    {id: 60, name: 'Сирота'},
    {id: 70, name: 'Упущенный клиент'},
    {id: 80, name: 'Клиент автосервиса'},
    {id: 100, name: 'Визит по звонку'},
    {id: 110, name: 'Забытый'}
]

export const EventType = {
    1: 'Звонок',
    2: 'Встреча',
    3: 'Повторный звонок',
    4: 'Тест драйв',
    5: 'Оформление выкупа',
    6: 'Отпуск',
    7: 'Обед',
    8: 'Осмотр',
    20: 'СТО',
    21: 'СТО выдача',
    30: 'ПСО',
    31: 'ПСО выдача',
    40: 'Страхование',
    50: 'Шины',
    60: 'Доп. оборудование',
    70: 'Заявка на кредит',
    80: 'Подбор автомобиля',
    90: 'Оформление продажи',
    100: 'Первичное обращение',
    110: 'Смена ответственного',
    120: 'Предоплата',
    130: 'Подтверждение встречи',
    140: 'Трейд-Ин',
    141: 'Видеозвонок',
    142: 'Франшиза. Сделка',
    143: 'Online коммуникация',
    144: 'Простое событие',
}

export const autoTypeList = [
    { name: 'Легковой автомобиль', code: 10 },
    { name: 'Грузовой автомобиль', code: 20 },
    { name: 'Легкий коммерческий', code: 30 },
    { name: 'Автобусы', code: 40 },
    { name: 'Прицеп', code: 50 },
    { name: 'Мотоцикл', code: 60 },
];
export const colorTypeList = [
    { name: 'Зеленая',code:0, color: 'rgb(221, 255, 221)' },
    { name: 'Желтая',code:10, color: 'rgb(255, 255, 221)', },
    { name: 'Красная',code:20, color: 'rgb(255, 221, 221)' },
];

export const locationType = [
    { code: 10, name: 'Выкуп' },
    { code: 20, name: 'Транзит' },
    { code: 30, name: 'ПСО' },
    { code: 40, name: 'СТО' },
    { code: 50, name: 'Доп. оборудование' },
    { code: 60, name: 'Реализация' },
    { code: 70, name: 'Запчасти и материалы' },
    { code: 80, name: 'Fleet' },
    { code: 90, name: 'Шины' },
    { code: 100, name: 'Индивидуальный' },
    { code: 110, name: 'ПСО - бокс' },
    { code: 120, name: 'СТО - бокс' }
];


const some_years = []
for (let z = new Date().getFullYear(); z > 1939; z--) {
    some_years.push({name: z})
}
export const Years = some_years

const some_capacities = []
for (let z = 800; z <= 6000; z = z + 100) {
    some_capacities.push({name: z})
}
export const Capacities = some_capacities

export const CategoryAuto = [{ id: 1, name: 'A' }, { id: 2, name: 'B' },
  { id: 3, name: 'C' }, { id: 4, name: 'D' }, { id: 5, name: 'S' }]

export const SteeringWheelType = [{ id: 10, name: 'Левый' }, { id: 20, name: 'Правый' }]