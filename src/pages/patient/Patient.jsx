import { React } from 'react'
import Navbar from '../../components/navbar/Navbar'
import { PatientContextProvider } from '../../context/patientContext'
import PatientContainer from '../../components/patient/PatientContainer'

const Patient = () => {
  return (
    <>
    <Navbar/>
    <PatientContextProvider>
      <PatientContainer/>
    </PatientContextProvider>
    </>
  )
}

export default Patient
