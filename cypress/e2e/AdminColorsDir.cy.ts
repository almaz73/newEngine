// https://on.cypress.io/api -- справочник по командам

Cypress.on('uncaught:exception', (err, runnable) => { // чтобы тест не падал на неожиданных ошибках
    return false
})
const env = Cypress.env()
const site = env.BASE_URL
let token = '';

describe('Тесты Админка / Цвет кузова', function () {
    beforeEach(function () {
        
        cy.viewport(1600, 900);
        cy.session('ourTest', () => {
            cy.visit(`${site}/v2/login`)
            cy.get('input[placeholder="Логин"]').type(env.LOGIN) // логин
            cy.get('input[placeholder="Пароль"]').type(env.PASSWORD) // пароль
            cy.get('input[value="Войти"]').click()
            cy.title().should('eq', 'Оценки')
        }, {cacheAcrossSpecs: true})

    })
    it('Добавление и удаление строки', () => {
        cy.visit(site + '/v2/admin') // заходим в раздел справочники
        cy.get('.el-select').contains("Выбери справочник").click();
        cy.get('.el-select-dropdown__item').contains('Цвета кузова').click();
        cy.get('.el-button').contains('Добавить').click();
        cy.get('input[placeholder="Цвет"]').type('Необычайный')
        cy.contains('Сохранить').click();
        cy.wait(1000);
        cy.contains('Необычайный').parent().parent().parent().find('[title="Удалить"]').click()
        cy.wait(500);
        cy.get('button').contains('Да').click()

    })
})