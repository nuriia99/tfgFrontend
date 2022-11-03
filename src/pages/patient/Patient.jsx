import { React, useEffect, useState } from 'react'
import Navbar from '../../components/navbar/Navbar'
import { useGlobalContext } from '../../hooks/useGlobalContext'
import { useNavigate, useParams } from 'react-router-dom'
import { getPatient } from '../../services/patient'
import PatientInfo from '../../components/patient/PatientInfo'
import PatientVisits from '../../components/patient/PatientVisits'
import PatientEntries from '../../components/patient/PatientEntries'
import PatientActiveIntelligence from '../../components/patient/PatientActiveIntelligence'

const Patient = () => {
  const { globalData } = useGlobalContext()
  const { worker } = globalData
  const [info, setInfo] = useState({
    name: null,
    sex: null,
    genre: null,
    age: null,
    dni: null,
    telephone: null,
    address: null,
    cip: null,
    mail: null,
    country: null,
    bornDate: null
  })
  const [ai, setAi] = useState({
    tabaquismo: null,
    actividadFisica: null,
    valoracionPacientesCronicos: null,
    frecuenciaCardiaca: null,
    peso: null,
    estatura: null,
    colesterolTotal: null
  })
  const navigate = useNavigate()
  useEffect(() => {
    if (!worker) navigate('/login')
  }, [])

  const { id: patientId } = useParams()

  useEffect(() => {
    const fetchData = async () => {
      const res = await getPatient({ id: patientId, token: globalData.token })
      if (res.request.status === 200) {
        setInfo(() => {
          return ({
            name: res.data.nombre + ' ' + res.data.apellido1 + ' ' + res.data.apellido2,
            sex: res.data.sexo,
            genre: res.data.genero,
            age: res.data.edad,
            dni: res.data.dni,
            telephone: res.data.telefono,
            address: res.data.direccion,
            cip: res.data.cip,
            mail: res.data.correo,
            country: res.data.paisOrigen,
            bornDate: res.data.fechaNacimiento
          })
        })
        setAi(() => {
          return ({
            tabaquismo: res.data.inteligenciaActiva.tabaquismo,
            actividadFisica: res.data.inteligenciaActiva.actividadFisica,
            valoracionPacientesCronicos: res.data.inteligenciaActiva.valoracionPacientesCronicos,
            frecuenciaCardiaca: res.data.inteligenciaActiva.frecuenciaCardiaca,
            peso: res.data.inteligenciaActiva.peso,
            estatura: res.data.inteligenciaActiva.estatura,
            colesterolTotal: res.data.inteligenciaActiva.colesterolTotal
          })
        })
      } else {
        console.log('El usuario no existe')
      }
    }
    fetchData()
  }, [])

  return (
    worker
      ? <>
      <Navbar/>
      <div className='patient'>
        <div className='patient_container'>
          <div className='patient_container_left'>
            <div className='patient_container_left_info'>
              <PatientInfo info={info}/>
            </div>
            <div className='patient_container_left_ai'>
              <PatientActiveIntelligence ai={ai}/>
            </div>
            <div className='patient_container_left_visits'>
              <PatientVisits/>
            </div>
          </div>
          <div className='patient_container_entries patient_container_card'>
            <PatientEntries/>
          </div>
        </div>
      </div>
    </>
      : null
  )
}

export default Patient
