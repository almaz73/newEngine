// https://on.cypress.io/api


const site = 'localhost:5173'
let token = '';

describe('Интеграционный тест справочников', function () {
    beforeEach(function () {
        cy.viewport(1600, 900);
        cy.session('ourTest', () => {
            cy.visit(`http://${site}/v2/login`)
            cy.get('input[placeholder="Логин"]').type('') // логин
            cy.get('input[placeholder="Пароль"]').type('') // пароль
            cy.get('input[value="Войти"]').click()
            cy.title().should('eq', 'Оценки')
        }, {cacheAcrossSpecs: true})

    })

    it('Попадание на стартовую страницу пользователя', () => {
        cy.visit('http://' + site + '/v2/deal') // заходим в раздел справочники
        cy.contains('h1', 'Оценки')
    })

    it('Переход в справочники и открытие справочника Марки', () => {
        cy.visit('http://' + site + '/v2/admin') // заходим в раздел справочники

        cy.get(".el-select").contains("Выбери справочник").click()

        cy.wait(2000); // Ожидание загрузки списка вариантов
    })
})