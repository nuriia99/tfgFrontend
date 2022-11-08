/* global cy */
/* eslint-disable no-undef */

const patientId = '63663957fff537e2cca3f844'
const username = 'FBU578MN'

describe('tests related to prescriptions', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3001/app/login')
    cy.get('[name=inputUsername]').type(username)
    cy.get('[name=inputPassword]').type(username)
    cy.get('#button_submit_login').click()
    cy.get('#navbar')
    cy.visit('http://localhost:3001/app/patients/' + patientId)
    cy.wait(500)
    cy.get('#prescription_section').click()
    cy.wait(500)
    cy.get('#prescription_button').click()
  })
  it('we can open correctly the prescription list', () => {
    cy.get('.table_row').eq(1).contains('Ibuprofeno Normon 600 mg comprimidos recubiertos con película EFG')
    cy.get('.table_row').eq(1).contains('1 x 12h')
  })
  it('if we have an allergy, the name is red color', () => {
    cy.get('.table_row_values').eq(4).should('have.css', 'color', 'rgb(182, 0, 0)')
  })
})

describe('tests related to documents', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3001/app/login')
    cy.get('[name=inputUsername]').type(username)
    cy.get('[name=inputPassword]').type(username)
    cy.get('#button_submit_login').click()
    cy.get('#navbar')
    cy.visit('http://localhost:3001/app/patients/' + patientId, {
      onBeforeLoad (win) {
        cy.stub(win, 'open').as('winOpen')
      }
    })
    cy.wait(500)
    cy.get('#documents_section').click()
    cy.wait(500)
    cy.get('#documents_button').click()
  })
  it('we can open correctly the documents list', () => {
    cy.get('.table_row').contains('Informe CUAP 1')
    cy.get('.table_row').contains('25/02/2018')
  })
  it('the documents are ordered by time', () => {
    cy.get('#table_row_0').invoke('text').then((text1) => {
      cy.get('#table_row_1').invoke('text').then((text2) => {
        const dateParts1 = text1.split('/')
        const date1 = new Date(+dateParts1[2], dateParts1[1] - 1, +dateParts1[0])
        const dateParts2 = text2.split('/')
        const date2 = new Date(+dateParts2[2], dateParts2[1] - 1, +dateParts2[0])
        expect(date1).to.be.gte(date2)
      })
    })
  })
  it('we can open correctly the document', () => {
    cy.get('.table_row').eq(1).click()
    cy.get('@winOpen').should('be.called')
    cy.visit('http://localhost:3001/app/pdf/docs/Informe1.pdf')
    cy.get('.document')
  })
})

describe('redirects works correctly', () => {
  it('patient redirect to login if the user is not autheticated', () => {
    cy.visit('http://localhost:3001/app/patients/' + patientId)
    cy.contains('Iniciar sesión')
  })
})

describe('tests related to active intelligence', () => {
  it('it is shown the active intelligence resume on the patient panel', () => {
    cy.visit('http://localhost:3001/app/login')
    cy.get('[name=inputUsername]').type(username)
    cy.get('[name=inputPassword]').type(username)
    cy.get('#button_submit_login').click()
    cy.get('#navbar')
    cy.visit('http://localhost:3001/app/patients/' + patientId)
    cy.get('.patient_ai_container').contains('IMC: 17.30 kg/m²')
    cy.get('.patient_ai_container').contains('Hábitos tóxicos: Sí')
    cy.get('.patient_ai_container').contains('Alergias: Sí')
  })

  it('if we press the button we acces to the ai panel and view correctly the information', () => {
    cy.get('#ai_button').click()
    cy.get('.patient_ai_table_row').eq(0).contains('25/02/2009')
    cy.get('.patient_ai_table_row').eq(5).contains('55')
  })
})
