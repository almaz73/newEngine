export const widthMobile = 500;
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
export const buyTypes = [
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
    {id: 2, value: 2, title: 'Выкуп'},
    {id: 1, value: 1, title: 'Продажа'},
    {id: 3, value: 3, title: 'Сервис'},
    {id: 4, value: 4, title: 'КСО'},
    {id: 5, value: 5, title: 'Fleet'},
    {id: 6, value: 6, title: 'Франшиза'},
    {id: 7, value: 7, title: 'Доп.оборуд.'},
    {id: 8, value: 8, title: 'Комиссия'},
    {id: 9, value: 9, title: 'Подбор авто'},
    {id: 10, value: 10, title: 'Сделка через салон'},
]

export const CommunicationTypes = [
    {id: 10, name: 'Входящий звонок'},
    {id: 15, name: 'Исходящий звонок'},
    {id: 20, name: 'Визит'},
    {id: 30, name: 'Заявка через интернет'}
]

export const BuyCategoryTypes = [
    {id: 10, title: 'Свободный выкуп'},
    {id: 20, title: 'Выездной выкуп'}
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
