// https://on.cypress.io/api -- справочник по командам

Cypress.on('uncaught:exception', (err, runnable) => { // чтобы тест не падал на неожиданных ошибках
    return false
})
const env = Cypress.env()
const site = env.BASE_URL
let token = '';

describe('Тесты Админка / Виды работ', function () {
    beforeEach(function () {
        
        cy.viewport(1600, 900);
        cy.session('ourTest', () => {
            cy.visit(`${site}/v2/login`)
            cy.get('input[placeholder="Логин"]').type(env.LOGIN)
            cy.get('input[placeholder="Пароль"]').type(env.PASSWORD) 
            cy.get('input[value="Войти"]').click()
            cy.title().should('eq', 'Оценки')
        }, {cacheAcrossSpecs: true})

    })
    it('Редактирование комбобокса и возвращение прежней строки', () => {
        cy.visit(site + '/v2/admin') 
        cy.get('.el-select').contains("Выбери справочник").click();
        cy.get('.el-select-dropdown__item').contains('Виды работ').click();
        cy.get('[title="Редактировать"]').first().click()
        cy.get('.modal__info').find('.el-select').first().invoke('text').then((text) => {
            cy.wrap(text).as('textSelect');
            
        });

        cy.get('.modal__info').find('.el-select').first().click()
        cy.get('.el-zoom-in-top-enter-active').find('.el-select-dropdown__item:not(.is-selected)').first().click()

        cy.wait(1000);

        cy.get('.modal__info').find('.el-select').first().click()
        cy.get('@textSelect').then(textSelect => {
            cy.get('.el-zoom-in-top-enter-active').find('.el-select-dropdown__item').contains(textSelect).click()
        });

    })
})