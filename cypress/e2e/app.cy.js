/* global cy */
/* eslint-disable no-undef */

describe('settings works correctly', () => {
  beforeEach(() => { // login
    cy.visit('http://localhost:3001/app/login')
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
    cy.visit('http://localhost:3001/app/settings')
    cy.get('.select_title').eq(0).click()
    cy.get('.option').eq(0).contains('CUAP Gran Corazón')
  })
})

describe('navbar works correctly', () => {
  beforeEach(() => { // login
    cy.visit('http://localhost:3001/app/login')
    cy.get('[name=inputUsername]').type('1Q2W3E4R')
    cy.get('[name=inputPassword]').type('1Q2W3E4R')
    cy.get('#button_submit_login').click()
  })

  it('navbar shows the worker name and role', () => {
    cy.contains('Marco Carreño Millan')
    cy.contains('Medicina general')
  })
})

describe('redirects and 404 not found works correctly', () => {
  it('home redirect to login if the user is not autheticated', () => {
    cy.visit('http://localhost:3001/app/home')
    cy.contains('Iniciar sesión')
  })

  it('settings redirect to login if the user is not autheticated', () => {
    cy.visit('http://localhost:3001/app/settings')
    cy.contains('Iniciar sesión')
  })

  it('main page redirect to login if the user is not autheticated ', () => {
    cy.visit('http://localhost:3001/')
    cy.contains('Iniciar sesión')
  })
})

describe('login and settings tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3001/app/login')
  })

  it('the login works correctly', () => {
    cy.get('[name=inputUsername]').type('1Q2W3E4R')
    cy.get('[name=inputPassword]').type('1Q2W3E4R')
    cy.get('#button_submit_login').click()
    cy.get('#navbar')
  })

  it('main page redirect to app/home if the user is autheticated', () => {
    cy.get('[name=inputUsername]').type('1Q2W3E4R')
    cy.get('[name=inputPassword]').type('1Q2W3E4R')
    cy.get('#button_submit_login').click()
    cy.get('#navbar')
    cy.visit('http://localhost:3001/')
    cy.get('#navbar')
  })

  it('the logout works correctly', () => {
    cy.get('[name=inputUsername]').type('1Q2W3E4R')
    cy.get('[name=inputPassword]').type('1Q2W3E4R')
    cy.get('#button_submit_login').click()
    cy.get('#navbar')
    cy.get('.settings_button').click()
    cy.get('.logout').click()
    cy.get('#button_submit_login')
    cy.visit('http://localhost:3001/app/home')
    cy.contains('Iniciar sesión')
  })

  it('if the user does not exists return an error message', () => {
    cy.get('[name=inputUsername]').type('1Q24R')
    cy.get('[name=inputPassword]').type('12W3ER')
    cy.get('#button_submit_login').click()
    cy.contains('El usuario no existe!')
  })

  it('if the password is incorrect return an error message', () => {
    cy.get('[name=inputUsername]').type('1Q2W3E4R')
    cy.get('[name=inputPassword]').type('12W3ER')
    cy.get('#button_submit_login').click()
    cy.contains('La contraseña es incorrecta!')
  })
})
