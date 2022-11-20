import { React, useEffect } from 'react'
import Navbar from '../../components/navbar/Navbar'
import { PatientContextProvider } from '../../context/patientContext'
import PatientContainer from '../../components/patient/PatientContainer'
import { useGlobalContext } from '../../hooks/useGlobalContext'
import { useNavigate } from 'react-router-dom'

const Patient = () => {
  const { globalData } = useGlobalContext()
  const { worker } = globalData
  const navigate = useNavigate()
  useEffect(() => {
    if (!worker) navigate('/app/login')
  }, [])
  return (
    <>
    {
      worker
        ? <>
          <Navbar/>
            <PatientContextProvider>
              <PatientContainer/>
            </PatientContextProvider>
          </>
        : null
    }
    </>
  )
}

export default Patient
