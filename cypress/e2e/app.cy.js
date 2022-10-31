/* global cy */
/* eslint-disable no-undef */

describe('settings works correctly', () => {
  beforeEach(() => { // login
    cy.visit('http://localhost:3001/login')
    cy.get('[name=inputUsername]').type('FBU578MN')
    cy.get('[name=inputPassword]').type('FBU578MN')
    cy.get('#button_submit_login').click()
    cy.get('.settings_button').click()
  })

  it('selects works correctly', () => {
    cy.get('.select_container').should('not.have.class', 'active')
    cy.get('.select_title').eq(0).click()
    cy.get('.select_container').should('have.class', 'active')
  })

  it('if there are not any options, does not show the arrow and does not active', () => {
    cy.get('.select_container').should('not.have.class', 'active')
    cy.get('.select_title').eq(1).click()
    cy.get('.select_container').should('not.have.class', 'active')
    cy.get('.select_title_arrow').should('have.class', 'no_options')
  })

  it('the current selections is not between the options after change values', () => {
    cy.get('.select_title').eq(0).click()
    cy.get('.option').eq(0).click()
    cy.get('.settings_submit_button').click()
    cy.intercept('http://localhost:3001/trabajadores/**/updateLenguage').as('update_lenguage')
    cy.wait('@update_lenguage')
    cy.visit('http://localhost:3001/settings')
    cy.get('.select_title').eq(0).click()
    cy.contains('CAP Antón de Borja').should('have.length', 1)
  })
})

describe('navbar works correctly', () => {
  beforeEach(() => { // login
    cy.visit('http://localhost:3001/login')
    cy.get('[name=inputUsername]').type('1Q2W3E4R')
    cy.get('[name=inputPassword]').type('1Q2W3E4R')
    cy.get('#button_submit_login').click()
  })

  it('navbar shows the worker name and role', () => {
    cy.contains('Marco Carreño Millan')
    cy.contains('Medicina general')
  })
})

describe('login and settings tests', () => {
  it('frontpage can be opened', () => {
    cy.visit('http://localhost:3001/login')
    cy.contains('Iniciar sesión')
  })

  it('home redirect to login if the user is not autheticated', () => {
    cy.visit('http://localhost:3001/home')
    cy.contains('Iniciar sesión')
  })

  it('settings redirect to login if the user is not autheticated', () => {
    cy.visit('http://localhost:3001/settings')
    cy.contains('Iniciar sesión')
  })

  it('the login works correctly', () => {
    cy.visit('http://localhost:3001/login')
    cy.get('[name=inputUsername]').type('1Q2W3E4R')
    cy.get('[name=inputPassword]').type('1Q2W3E4R')
    cy.get('#button_submit_login').click()
    cy.get('#navbar')
  })

  it('if the user does not exists return an error message', () => {
    cy.visit('http://localhost:3001/login')
    cy.get('[name=inputUsername]').type('1Q24R')
    cy.get('[name=inputPassword]').type('12W3ER')
    cy.get('#button_submit_login').click()
    cy.contains('El usuario no existe!')
  })

  it('if the password is incorrect return an error message', () => {
    cy.visit('http://localhost:3001/login')
    cy.get('[name=inputUsername]').type('1Q2W3E4R')
    cy.get('[name=inputPassword]').type('12W3ER')
    cy.get('#button_submit_login').click()
    cy.contains('La contraseña es incorrecta!')
  })
})
