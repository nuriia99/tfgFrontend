import { useContext } from 'react'
import patientContext from '../context/patientContext'

export const usePatientContext = () => {
  const { patientData, dispatch } = useContext(patientContext)

  const updatePatient = async (data) => {
    dispatch({ type: 'UPDATEPATIENT', payload: data })
  }

  const updatePatientAndAi = (data) => {
    dispatch({ type: 'UPDATEPATIENTANDAI', payload: data })
  }

  const updateEntries = (data) => {
    dispatch({ type: 'UPDATEENTRIES', payload: data })
  }

  return { patientData, updatePatient, updateEntries, updatePatientAndAi }
}
