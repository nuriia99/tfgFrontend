import { React, useEffect, useState } from 'react'
import Navbar from '../../components/navbar/Navbar'
import { useGlobalContext } from '../../hooks/useGlobalContext'
import { useNavigate, useParams } from 'react-router-dom'
import { getPatient } from '../../services/patient'
import PatientInfo from '../../components/patient/PatientInfo'
import PatientVisits from '../../components/patient/PatientVisits'
import PatientEntries from '../../components/patient/PatientEntries'
import PatientActiveIntelligenceCard from '../../components/patient/PatientActiveIntelligenceCard'
import PatientActiveIntelligence from '../../components/patient/PatientActiveIntelligence'
import { getAi } from '../../services/activeIntelligence'

const Patient = () => {
  const { globalData } = useGlobalContext()
  const { worker } = globalData
  const [info, setInfo] = useState()
  const [ai, setAi] = useState()
  const [aiPanel, setAiPanel] = useState(false)
  const [aiInfo, setAiInfo] = useState()

  const handleClickAiPanel = () => {
    setAiPanel(!aiPanel)
  }

  const navigate = useNavigate()
  useEffect(() => {
    if (!worker) navigate('/login')
  }, [])

  const token = globalData.token
  const { id: patientId } = useParams()

  useEffect(() => {
    const fetchData = async () => {
      const res = await getPatient({ id: patientId, token: globalData.token })
      if (res.request.status === 200) {
        setInfo(() => {
          const date = new Date(res.data.fechaNacimiento)
          let day = date.getDay()
          if (day < 10) day = '0' + day
          let month = date.getMonth()
          if (month < 10) month = '0' + month
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
            bornDate: day + '/' + month + '/' + date.getFullYear()
          })
        })
        setAiInfo(await getAi({ id: patientId, token }))
        setAi(() => {
          return ({
            tabaquismo: res.data.inteligenciaActiva.tabaquismo,
            peso: res.data.inteligenciaActiva.peso,
            estatura: res.data.inteligenciaActiva.estatura,
            alergias: res.data.alergias,
            alcohol: res.data.inteligenciaActiva.alcohol,
            drogas: res.data.inteligenciaActiva.drogas
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
        {aiPanel
          ? <PatientActiveIntelligence ai={aiInfo} handleClick={handleClickAiPanel}/>
          : <div className='patient_container'>
              <div className='patient_container_left'>
                <div className='patient_container_left_info'>
                  {info ? <PatientInfo info={info}/> : null}
                </div>
                <div className='patient_container_left_ai'>
                  {ai ? <PatientActiveIntelligenceCard ai={ai} handleClick={handleClickAiPanel}/> : null}
                </div>
                <div className='patient_container_left_visits'>
                  <PatientVisits/>
                </div>
              </div>
              <div className='patient_container_entries patient_container_card'>
                <PatientEntries/>
              </div>
            </div>
        }
      </div>
    </>
      : null
  )
}

export default Patient
