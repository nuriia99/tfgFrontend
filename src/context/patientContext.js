import { React, createContext, useReducer } from 'react'

const patientContext = createContext({
  patient: '',
  entradas: ''
})

export const patientReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATEPATIENT':
      return { ...state, patient: action.payload }
    case 'UPDATEENTRIES':
      return { ...state, entradas: action.payload }
    default:
      return null
  }
}

export const PatientContextProvider = ({ children }) => {
  const [patientData, dispatch] = useReducer(patientReducer)

  return (
    <patientContext.Provider value={{ patientData, dispatch }}>
      {children}
    </patientContext.Provider>
  )
}

export default patientContext
