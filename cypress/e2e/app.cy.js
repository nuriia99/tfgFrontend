/* global cy */
/* eslint-disable no-undef */

describe('login and settings tests', () => {
  it('frontpage can be opened', () => {
    cy.visit('http://localhost:3001/login')
    cy.contains('Iniciar sesión')
  })

  it('home redirect to login', () => {
    cy.visit('http://localhost:3001/home')
    cy.contains('Iniciar sesión')
  })

  it('settings redirect to login', () => {
    cy.visit('http://localhost:3001/settings')
    cy.contains('Iniciar sesión')
  })

  it('the login works correctly', () => {
    cy.visit('http://localhost:3001/login')
    // cy.get('[name=inputUsername]').type('1Q2W3E4R')
    // cy.get('[name=inputPassword]').type('1Q2W3E4R')
    cy.get('#button_submit_login').click()
    cy.get('#navbar')
  })
})
