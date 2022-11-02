import { React, useEffect, useState } from 'react'
import Navbar from '../../components/navbar/Navbar'
import { useGlobalContext } from '../../hooks/useGlobalContext'
import { useNavigate, useParams } from 'react-router-dom'
import { getPatient } from '../../services/patient'
import { getLenguage } from '../../services/lenguage'
import PatientInfo from '../../components/patient/PatientInfo'
import PatientVisits from '../../components/patient/PatientVisits'
import PatientEntries from '../../components/patient/PatientEntries'

const Patient = () => {
  const { globalData } = useGlobalContext()
  const { worker } = globalData
  const navigate = useNavigate()
  useEffect(() => {
    if (!worker) navigate('/login')
  }, [])

  const { id: patientId } = useParams()
  console.log(patientId)

  const [error, setError] = useState()

  useEffect(() => {
    const fetchData = async () => {
      const res = await getPatient({ id: patientId, token: globalData.token })
      console.log('res', res)
      if (res.response.status === 200) {
        console.log('paciente ha llegado')
      } else {
        setError(leng.prueba)
        console.log(error)
      }
    }
    fetchData()
    const leng = getLenguage(globalData.lenguage, 'settings')
  }, [])

  return (
    worker
      ? <>
      <Navbar/>
      <div className='patient'>
        <div className="patient_container">
          <div className="patient_container_info">
            <PatientInfo/>
          </div>
          <div className="patient_container_visits">
            <PatientVisits/>
          </div>
          <div className="patient_container_entries">
            <PatientEntries/>
          </div>
        </div>
      </div>
    </>
      : null
  )
}

export default Patient
