/* global cy */
/* eslint-disable no-undef */

describe('redirects works correctly', () => {
  it('patient redirect to login if the user is not autheticated', () => {
    cy.visit('http://localhost:3001/patient/54654379543')
    cy.contains('Iniciar sesión')
  })
})
