// https://on.cypress.io/api


const site = 'localhost:5173'
let token = '';

describe('Интеграционный тест справочников', function () {
    beforeEach(function () {
        cy.viewport(1600, 900);

        // Авторизация / нужно придумать, чтобы каждый раз не авторизоваться
        cy.visit(`http://${site}/v2/login`)
        cy.get('input[placeholder="Логин"]').type('___') // логин
        cy.get('input[placeholder="Пароль"]').type('___') // пароль
        cy.get('input[value="Войти"]').click()
        cy.title().should('eq', 'Оценки')

    })

    it('Попадание на стартовую страницу пользователя', () => {
        cy.contains('h1', 'Оценки')
    })

    it('Переход в справочники и открытие справочника Марки', () => {
        cy.visit('http://' + site + '/v2/admin') // заходим в раздел справочники

        cy.get(".el-select").contains("Выбери справочник").click()

        cy.contains('Марки').click()
    })
})