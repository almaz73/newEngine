export const workflows = [
    {id: 2, value: 2, title: 'Выкуп'},
    {id: 1, value: 1, title: 'Продажа'},
    {id: 3, value: 3, title: 'Сервис'},
    {id: 4, value: 4, title: 'КСО'},
    {id: 5, value: 5, title: 'Fleet'},
    {id: 7, value: 7, title: 'Доп.оборуд.'},
    {id: 8, value: 8, title: 'Комиссия'},
    {id: 9, value: 9, title: 'Подбор авто'},
    {id: 10, value: 10, title: 'Сделка через салон'},
]

const some_years = []
for (let z = new Date().getFullYear(); z > 1939; z--) {
    some_years.push({name: z})
}
export const years = some_years

const some_capacities = []
for (let z = 800; z <= 6000; z = z + 100) {
    some_capacities.push({name: z})
}

export const capacities = some_capacities
