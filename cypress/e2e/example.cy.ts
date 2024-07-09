// https://on.cypress.io/api -- справочник по командам

Cypress.on('uncaught:exception', (err, runnable) => { // чтобы тест не падал на неожиданных ошибках
    return false
})

const site = 'localhost:5173'
let token = '';

describe('Интеграционный тест справочников', function () {
    beforeEach(function () {
        cy.viewport(1600, 900);
        cy.session('ourTest', () => {
            cy.visit(`http://${site}/v2/login`)
            cy.get('input[placeholder="Логин"]').type('d.gumerov') // логин
            cy.get('input[placeholder="Пароль"]').type('gumerov123') // пароль
            cy.get('input[value="Войти"]').click()
            cy.title().should('eq', 'Оценки')
        }, {cacheAcrossSpecs: true})

    })

    // it('Попадание на стартовую страницу пользователя', () => {
    //     cy.visit('http://' + site + '/v2/deal') // заходим в раздел справочники
    //     cy.wait(2000); // Ожидание загрузки списка вариантов
    //     cy.contains('h1', 'Оценки')
    // })

    // it('Переход в справочник Марки, проверка Kia Ria, посмотреть и выход к списку всех машин ', () => {
    //     cy.visit('http://' + site + '/v2/admin') // заходим в раздел справочники
    //
    //     cy.get('.el-select').contains("Выбери справочник").click();// Найти el-select, нажать
    //     cy.get('.el-select-dropdown__item').contains('Марки').click();        // Выбрать нужный вариант, нажать
    //
    //     cy.contains('Kia').click(); // Смотрим все модели Киа
    //     cy.contains('◄').click() // выходим
    // })

    it('Справочник Лист осмотра.  Добавляем и удаляем Осмотр', () => {
        cy.visit('http://' + site + '/v2/admin') // заходим в раздел справочники

        cy.get('.el-select').contains("Выбери справочник").click();
        cy.get('.el-select-dropdown__item').contains('Лист осмотра').click();

        cy.get('.el-button').contains(' Добавить').click();

        cy.get('[placeholder="Название *"]').type('ambulance17')

        cy.get('.el-select').contains('Категория осмотра').click();
        cy.get('.el-select-dropdown__item').contains('Под капотом').click();

        cy.get('.el-select').contains('Интерфейс').click();
        cy.get('.el-select-dropdown__item').contains('IsStock').click();

        cy.get('[placeholder="Порядок"]').type('17')

        cy.contains('Сохранить').click(); // Смотрим все модели Киа
        /// Теперь удаляем (пока не получается нажать на кноку выбранной строки)
        // либо киприс не умеет, либо нужно хорошенько поискать
        cy.wait(2000);


        // cy.get('.el-table__row').parent().contains('ambulance17').get('img')
        // .get('img').get('[title="Редактировать"]')
        // cy.get('img').click()


        // Найдите элемент el-select
        // cy.get('img').contains('[title="Редактировать"]').first().click()



        // Нажмите на комбобокс, чтобы открыть список вариантов
        // cy.get('@select').click();

        //     .as('select');
        //
        // // Нажмите на комбобокс, чтобы открыть список вариантов
        // cy.get('@select').click();



       // cy.get('.el-table__row').contains('tr','Картотека арбитражных дел').as('select');
       //
       //  cy.get('@select').get('img')
       //  cy.get('[title="Редактировать"]').last().click()


    })
})