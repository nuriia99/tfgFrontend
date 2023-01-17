/* global cy */
/* eslint-disable no-undef */
const username = '1Q2W3E4R'

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
    cy.get('.settings_button').eq(1).click()
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

describe('settings works correctly', () => {
  beforeEach(() => { // login
    cy.visit('http://localhost:3001/app/login')
    cy.get('[name=inputUsername]').type('FBU578MN')
    cy.get('[name=inputPassword]').type('FBU578MN')
    cy.get('#button_submit_login').click()
    cy.get('.settings_button').eq(1).click()
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
  })

  it('the current selections is not between the options after change values', () => {
    cy.get('.select_title').eq(0).click()
    cy.get('.option').eq(0).click()
    cy.get('.settings_submit_button').click()
    cy.wait(1000)
    cy.get('.correct')
    cy.visit('http://localhost:3001/app/settings')
    cy.get('.select_title').eq(0).click()
    cy.get('.option').eq(0).contains('CUAP Gran Corazón')
  })
})

describe('tests related to schedules', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3001/app/login')
    cy.get('[name=inputUsername]').type(username)
    cy.get('[name=inputPassword]').type(username)
    cy.get('#button_submit_login').click()
    cy.wait(500)
    cy.get('#navbar')
  })
  it('see the schedule works fine', () => {
    cy.get('.schedule_header').contains('Hora')
  })
  it('changing the date works fine', () => {
    cy.get('.react-date-picker__calendar-button').click()
    cy.get('.react-calendar__tile').eq(28).click()
    cy.get('.schedule_row').eq(0).contains('10:30')
  })
  it('see the clinical info of a patient works fine', () => {
    cy.get('.react-date-picker__calendar-button').click()
    cy.get('.react-calendar__tile').eq(28).click()
    cy.get('.schedule_row').eq(0).click()
    cy.get('.button_classic').eq(1).click()
    cy.get('.patient_info_name').eq(0).contains('FÁTIMA MENÉNDEZ BECERRA')
  })
  it('create an appointment works fine', () => {
    cy.get('[name=inputFem]').click()
    cy.wait(500)
    cy.get('.schedule_row').eq(0).click()
    cy.get('.button_classic').eq(2).click()
    cy.get('[name=inputTime]').type('23:30')
    cy.get('.button_classic').eq(1).click()
    cy.wait(500)
    cy.get('.schedule_row').contains('23:30')
  })
})

describe('search patient works correctly', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3001/app/login')
    cy.get('[name=inputUsername]').type(username)
    cy.get('[name=inputPassword]').type(username)
    cy.get('#button_submit_login').click()
    cy.get('#navbar')
  })
  it('search finds the patient', () => {
    cy.get('[name=inputName]').type('alex')
    cy.get('[name=inputFem]').click()
    cy.get('#button_submit_search').click()
    cy.get('.big').eq(1).contains('ALEXANDRA')
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
