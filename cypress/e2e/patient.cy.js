/* global cy */
/* eslint-disable no-undef */

const patientId = '6378be9738938f2984193dbe'
const username = 'FBU578MN'

describe('tests related to prescriptions', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3001/app/login')
    cy.get('[name=inputUsername]').type(username)
    cy.get('[name=inputPassword]').type(username)
    cy.get('#button_submit_login').click()
    cy.wait(500)
    cy.get('#navbar')
    cy.visit('http://localhost:3001/app/patients/' + patientId)
    cy.wait(500)
    cy.get('#prescription_section').click()
    cy.wait(500)
    cy.get('#prescriptions_button').click()
  })
  it('appears the summary about the prescriptions correctly', () => {
    cy.get('.prescription_row').eq(0).contains('ATORVASTATINA EDIGEN 10MG COMPRIMIDOS RECUBIERTOS CON PELÍCULA EFG')
  })
  it('we can open correctly the prescription list', () => {
    cy.get('.prescription_row').eq(1).contains('BUDESONIDA ALDO-UNIÓN 200MG/PULSACIÓN')
    cy.get('.prescription_row').eq(1).contains('1 x 12h.')
  })
  it('if we have an allergy, the name is red color', () => {
    cy.get('.prescription_row').eq(5).contains('PARACETAMOL MABO 500MG COMPRIMIDOS').should('have.css', 'color', 'rgb(182, 0, 0)')
  })
  it('the outdate prescriptions does not show', () => {
    cy.get('.prescriptions_container_table').contains('caducada').should('not.exist')
  })
  it('see a prescription works correctly', () => {
    cy.get('.prescription_row').eq(0).click()
    cy.get('.seccion').eq(0).contains('Elecció del medicament')
    cy.get('.search').invoke('text').should('not.be.empty')
  })

  it('recomendation prescriptions system works correctly', () => {
    cy.visit('http://localhost:3001/app/patients/' + patientId)
    cy.wait(500)
    cy.get('.añadir_nota').click()
    cy.get('.search').invoke('text').should('be.empty')
    cy.get('.diagnosis_item_name').eq(3).click()
    cy.get('.capsules_button').click()
    cy.wait(500)
    cy.get('.recs')
  })

  it('create a prescription works correctly', () => {
    cy.get('.capsules_button').click()
    cy.get('.search').invoke('text').should('be.empty')
    cy.get('.search_button').click()
    cy.wait(500)
    cy.get('.med_row').eq(0).click()
    cy.get('.button_classic').eq(1).click()
    cy.get('.search').invoke('text').should('not.be.empty')
    cy.get('[name=inputName]').eq(0).clear().type(200)
    cy.get('.button_classic').eq(0).click()
    cy.wait(500)
    cy.get('.prescription_row').last().contains('200 x 24h')
  })

  it('update a prescription works correctly', () => {
    cy.get('.prescription_row').last().contains('200 x 24h').click()
    cy.get('[name=inputName]').eq(0).clear().type(400)
    cy.get('[name=inputName]').eq(1).clear().type(24)
    cy.get('.button_classic').eq(0).click()
    cy.wait(500)
    cy.get('.prescription_row').last().contains('400 x 24h')
  })

  it('delete a prescription works correctly', () => {
    cy.get('.delete_prescription_button').last().click()
    cy.get('.accept').click()
    cy.wait(500)
    cy.get('.prescription_row').last().contains('400 x 24h').should('not.exist')
  })
})

describe('tests related to documents', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3001/app/login')
    cy.get('[name=inputUsername]').type(username)
    cy.get('[name=inputPassword]').type(username)
    cy.get('#button_submit_login').click()
    cy.wait(500)
    cy.get('#navbar')
    cy.visit('http://localhost:3001/app/patients/' + patientId, {
      onBeforeLoad (win) {
        cy.stub(win, 'open').as('winOpen')
      }
    })
    cy.wait(500)
    cy.get('#documents_section').click()
  })
  it('appears the summary about the documents correctly', () => {
    cy.get('.panel').contains('Informe CUAP Gran Corazón')
  })
  it('we can open correctly the documents list', () => {
    cy.wait(500)
    cy.get('#documents_button').click()
    cy.get('.documents_row').eq(0).contains('Informe CUAP Gran Corazón')
    cy.get('.documents_row').eq(0).contains('16/11/2022')
  })
  it('the documents are ordered by time', () => {
    cy.wait(500)
    cy.get('#documents_button').click()
    cy.get('.date_0').invoke('text').then((text1) => {
      cy.get('.date_1').invoke('text').then((text2) => {
        const dateParts1 = text1.split('/')
        const date1 = new Date(+dateParts1[2], dateParts1[1] - 1, +dateParts1[0])
        const dateParts2 = text2.split('/')
        const date2 = new Date(+dateParts2[2], dateParts2[1] - 1, +dateParts2[0])
        expect(date1).to.be.gte(date2)
      })
    })
  })
  it('we can open correctly the document', () => {
    cy.wait(500)
    cy.get('#documents_button').click()
    cy.get('.documents_row').eq(0).click()
    cy.get('@winOpen').should('be.called')
  })
  // it('delete a docuemnts works correctly', () => {
  //   cy.wait(500)
  //   cy.get('#documents_button').click()
  //   cy.get('.delete_prescription_button').last().click()
  //   cy.get('.accept').click()
  //   cy.wait(500)
  //   cy.contains('Informe CUAP 1').should('not.exist')
  // })
})

describe('redirects works correctly', () => {
  it('patient redirect to login if the user is not autheticated', () => {
    cy.visit('http://localhost:3001/app/patients/' + patientId)
    cy.contains('Iniciar sesión')
  })
})

describe('tests related to appointments', () => {
  it('appears the visits summary correctly', () => {
    cy.visit('http://localhost:3001/app/login')
    cy.get('[name=inputUsername]').type(username)
    cy.get('[name=inputPassword]').type(username)
    cy.get('#button_submit_login').click()
    cy.wait(500)
    cy.get('#navbar')
    cy.visit('http://localhost:3001/app/patients/' + patientId)
    cy.wait(500)
    cy.get('#visits_section').click()
    cy.get('.panel').eq(0).contains('Medicina general')
  })
  it('create an appointment works correctly', () => {
    cy.get('.button_plus').eq(1).click()
    cy.get('.new_appointment_button').click()
    cy.get('[name=inputTime]').type('23:30')
    cy.get('.button_classic').eq(1).click()
    cy.wait(500)
    cy.get('.visits_row').contains('23:30')
  })
  it('seeing an appointment works correctly', () => {
    cy.get('.visits_row').last().click()
    cy.get('.select_title').contains('Presencial 15min')
  })
  it('updating an appointment works correctly', () => {
    cy.get('[name=motivo]').type('test')
    cy.get('.button_classic').eq(1).click()
    cy.wait(500)
    cy.get('.visits_row').last().contains('test')
  })
  it('delete an appointment works correctly', () => {
    cy.get('.delete_appointment_button').last().click()
    cy.get('.accept').click()
    cy.wait(500)
    cy.get('.visits_row').last().contains('test').should('not.exist')
  })
})

describe('tests related to active intelligence', () => {
  it('it is shown the active intelligence resume on the patient panel', () => {
    cy.visit('http://localhost:3001/app/login')
    cy.get('[name=inputUsername]').type(username)
    cy.get('[name=inputPassword]').type(username)
    cy.get('#button_submit_login').click()
    cy.wait(500)
    cy.get('#navbar')
    cy.visit('http://localhost:3001/app/patients/' + patientId)
    cy.get('.patient_ai_container').contains('IMC: 17.14 kg/m²')
    cy.get('.patient_ai_container').contains('Hàbits tòxics: Sí')
    cy.get('.patient_ai_container').contains('Al·lèrgies: Sí')
  })

  it('if we press the button we acces to the ai panel and view correctly the information', () => {
    cy.get('.ai_button').click()
    cy.get('.patient_ai_table_row').eq(0).contains('25/02/2009')
    cy.get('.patient_ai_table_row').eq(5).contains('leve')
  })
})

describe('tests related to entries', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3001/app/login')
    cy.get('[name=inputUsername]').type(username)
    cy.get('[name=inputPassword]').type(username)
    cy.get('#button_submit_login').click()
    cy.wait(500)
    cy.get('#navbar')
    cy.visit('http://localhost:3001/app/patients/' + patientId)
  })

  it('filter the entries works correctly', () => {
    cy.wait(500)
    cy.get('.button_tag.inactive').eq(4).click()
    cy.get('.diagnosis_item_name').eq(3).click()
    cy.get('.diagnosis_item').eq(3).should('have.css', 'background-color', 'rgb(255, 234, 0)')
  })

  it('the entries are showing correctly', () => {
    cy.wait(500)
    cy.get('.note').contains('GRIPE A')
  })

  it('see an entry works correctly', () => {
    cy.wait(500)
    cy.get('.note').contains('GRIPE A').click()
    cy.get('.search').contains('Gripe A')
  })

  it('translate an entry works correctly', () => {
    cy.wait(500)
    cy.contains('Traduir').eq(0).click()
    cy.wait(2000)
    cy.contains('Mujer acude a urgencias por disnea, tos seca y fiebre.').should('not.exist')
  })

  it('create an entry works correctly', () => {
    cy.wait(500)
    cy.get('.añadir_nota').click()
    cy.get('.search').invoke('text').should('be.empty')
    cy.get('[name=motivo]').type('prueba test')
    cy.get('.diagnosis_item_name').eq(3).click()
    cy.get('.diagnosis_item').eq(3).should('have.css', 'background-color', 'rgb(255, 234, 0)')
    cy.get('.addNote').click()
    cy.wait(500)
    cy.contains('prueba test')
  })

  it('recomendation diagnosis system works correctly', () => {
    cy.wait(500)
    cy.get('.añadir_nota').click()
    cy.get('[name=clinica]').type('fiebre ')
    cy.wait(500)
    cy.get('.recs')
  })

  it('update an entry works correctly', () => {
    cy.wait(500)
    cy.get('.note').eq(0).click()
    cy.get('[name=motivo]').contains('prueba test').clear().type('update test')
    cy.get('.search').invoke('text').should('not.be.empty')
    cy.get('.addNote').click()
    cy.wait(500)
    cy.contains('update test')
  })

  it('import history works correctly', () => {
    cy.wait(500)
    cy.get('.note').eq(0).click()
    cy.get('.button_classic').eq(1).click()
    cy.get('[name=antecedentes]').invoke('text').should('not.be.empty')
  })

  it('delete a note and an entry works correctly', () => {
    cy.wait(500)
    cy.get('.note').eq(0).click()
    cy.get('.trash').click()
    cy.get('.accept').click()
    cy.wait(500)
    cy.get('.note').eq(0).contains('update test').should('not.exist')
    cy.get('.entry_info').eq(0).contains('RUÍZ').should('not.exist')
  })
})
