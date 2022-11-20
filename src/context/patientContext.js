import { React, createContext, useReducer } from 'react'

const INITIAL_STATE = {
  patient: null
}

const patientContext = createContext(INITIAL_STATE)

export const patientReducer = (state, action) => {
  let patient = null
  switch (action.type) {
    case 'UPDATEPATIENT':
      return { ...state, patient: action.payload }
    case 'UPDATEPATIENTANDAI':
      patient = action.payload.dataPatient
      patient.inteligenciaActiva = action.payload.dataAi
      return { ...state, patient }
    default:
      return null
  }
}

export const PatientContextProvider = ({ children }) => {
  const [patientData, dispatch] = useReducer(patientReducer, INITIAL_STATE)

  return (
    <patientContext.Provider value={{ patientData, dispatch }}>
      {children}
    </patientContext.Provider>
  )
}

export default patientContext
