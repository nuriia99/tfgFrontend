/* global cy */
/* eslint-disable no-undef */
const username = '1Q2W3E4R'

describe('tests related to goals', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3001/app/login')
    cy.get('[name=inputUsername]').type(username)
    cy.get('[name=inputPassword]').type(username)
    cy.get('#button_submit_login').click()
    cy.wait(500)
    cy.get('#navbar')
    cy.get('li').eq(1).click({ force: true })
  })

  it('it shows the lists generated', () => {
    cy.get('#button_submit_search').click()
    cy.contains('CARU1111111111')
  })
})

describe('tests related to goals', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3001/app/login')
    cy.get('[name=inputUsername]').type(username)
    cy.get('[name=inputPassword]').type(username)
    cy.get('#button_submit_login').click()
    cy.wait(500)
    cy.get('#navbar')
    cy.get('li').eq(0).click({ force: true })
  })

  it('it shows the goals list correctly', () => {
    cy.get('.goals_title')
    cy.get('.goals_seccion_seccion').eq(0).contains('Malaltia cardiovascular')
  })

  // it('if the result is less than half result, the color is red', () => {
  //   cy.get('.red').should('have.css', 'background-color', 'rgb(255, 188, 188)')
  // })

  it('if the result is more than half result but less than the result, the color is yellow', () => {
    cy.get('.yellow').should('have.css', 'background-color', 'rgb(255, 246, 144)')
  })

  it('if the result is bigger than half result, the color is green', () => {
    cy.get('.green').should('have.css', 'background-color', 'rgb(150, 219, 129)')
  })

  it('show goal information works correctly', () => {
    cy.get('.goals_goal_code').eq(0).click()
    cy.get('.infoGoal_container_name')
  })

  it('show patient list goals works correctly', () => {
    cy.get('.goals_goal_name').eq(1).click()
    cy.contains('CARU1111111111').click()
    cy.wait(500)
  })
})
