import { React, useEffect } from 'react'
import Navbar from '../../components/navbar/Navbar'
import { PatientContextProvider } from '../../context/patientContext'
import ReportContainer from '../../components/patient/ReportContainer'
import { useGlobalContext } from '../../hooks/useGlobalContext'
import { useNavigate } from 'react-router-dom'

const AddReport = () => {
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
              <ReportContainer/>
            </PatientContextProvider>
          </>
        : null
    }
    </>
  )
}

export default AddReport
