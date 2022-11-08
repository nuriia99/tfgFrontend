import { React, useEffect, useState } from 'react'
import Navbar from '../../components/navbar/Navbar'
import { useGlobalContext } from '../../hooks/useGlobalContext'
import { getLenguage } from '../../services/lenguage'
import { useNavigate, useParams } from 'react-router-dom'
import { getPatient } from '../../services/patient'
import PatientInfo from '../../components/patient/PatientInfo'
import PatientEntries from '../../components/patient/PatientEntries'
import PatientActiveIntelligenceCard from '../../components/patient/PatientActiveIntelligenceCard'
import PatientActiveIntelligence from '../../components/patient/PatientActiveIntelligence'
import PrescriptionCard from '../../components/patient/PrescriptionCard'
import PrescriptionList from '../../components/patient/PrescriptionList'
import DocumentsCard from '../../components/patient/DocumentsCard'
import VisitsCard from '../../components/patient/VisitsCard'
import { getAi } from '../../services/activeIntelligence'
import DocumentsList from '../../components/patient/DocumentList'
import { getDate } from '../../services/utils'

const Patient = () => {
  const { globalData, updatePatient } = useGlobalContext()
  const leng = getLenguage(globalData.lenguage, 'patient')
  const { worker } = globalData
  const [info, setInfo] = useState()
  const [ai, setAi] = useState()
  const [aiPanel, setAiPanel] = useState(false)
  const [aiInfo, setAiInfo] = useState()
  const [loading, setLoading] = useState(false)
  const [extraFeatures, setExtraFeatures] = useState('prescripciones')
  const [extraFeaturesActive, setextraFeaturesActive] = useState({
    prescriptions: 'active',
    documents: 'inactive',
    visits: 'inactive'
  })
  const [principalComponent, setPrincipalComponent] = useState()

  const handleClickAiPanel = () => {
    setAiPanel(!aiPanel)
  }

  const handleExtraFeatures = (e) => {
    const name = e.target.name
    setExtraFeatures(() => {
      if (name === 'prescripciones') {
        setextraFeaturesActive((prev) => {
          return { prescriptions: 'active', documents: 'inactive', visits: 'inactive' }
        })
        return <PrescriptionCard handleClickPrincipalComponent={ handleClickPrincipalComponent }/>
      } else if (name === 'documentos') {
        setextraFeaturesActive((prev) => {
          return { prescriptions: 'inactive', documents: 'active', visits: 'inactive' }
        })
        return <DocumentsCard handleClickPrincipalComponent={ handleClickPrincipalComponent }/>
      }
      setextraFeaturesActive((prev) => {
        return { prescriptions: 'inactive', documents: 'inactive', visits: 'active' }
      })
      return <VisitsCard/>
    })
  }

  const handleClickPrincipalComponent = (e) => {
    const name = e.target.getAttribute('name')
    setPrincipalComponent(() => {
      if (name === 'prescription_button') {
        return <PrescriptionList patient={{ allergy: globalData.patient.inteligenciaActiva.alergias, prescriptions: globalData.patient.prescripciones }}/>
      } else if (name === 'documents_button') {
        return <DocumentsList/>
      } else if (name === 'entries') {
        return <PatientEntries info={{
          id: globalData.patient._id,
          token: globalData.token
        }} />
      }
    })
  }

  const navigate = useNavigate()
  useEffect(() => {
    if (!worker) navigate('/app/login')
  }, [])

  const token = globalData.token
  const { id: patientId } = useParams()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const res = await getPatient({ id: patientId, token: globalData.token })
      if (res.request.status === 200) {
        updatePatient(res.data)
        setInfo(() => {
          const date = getDate(res.data.fechaNacimiento)
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
            bornDate: date
          })
        })
        setAiInfo(await getAi({ id: patientId, token }))
        setAi(() => {
          return ({
            tabaquismo: res.data.inteligenciaActiva.tabaquismo,
            peso: res.data.inteligenciaActiva.peso,
            estatura: res.data.inteligenciaActiva.estatura,
            alergias: res.data.inteligenciaActiva.alergias,
            alcohol: res.data.inteligenciaActiva.alcohol,
            drogas: res.data.inteligenciaActiva.drogas
          })
        })
        setPrincipalComponent(<PatientEntries info={{
          id: res.data._id,
          token: globalData.token
        }} />)
        setExtraFeatures(<PrescriptionCard handleClickPrincipalComponent={ handleClickPrincipalComponent }/>)
      } else {
        console.log('El usuario no existe')
        if (res.request.status === 403) navigate('/app/login')
      }
      setLoading(false)
    }
    fetchData()
  }, [])
  return (
    worker
      ? <>
      <Navbar/>
      <div className='patient'>
        {!loading
          ? <>
            {
              aiPanel
                ? <PatientActiveIntelligence ai={aiInfo} handleClick={handleClickAiPanel}/>
                : <div className='patient_container'>
                    <div className='patient_container_left'>
                      <div className='patient_container_left_info'>
                        {info ? <PatientInfo handleClickPrincipalComponent={ handleClickPrincipalComponent } info={info}/> : null}
                      </div>
                      <div className='patient_container_left_ai'>
                        {ai ? <PatientActiveIntelligenceCard ai={ai} handleClick={handleClickAiPanel}/> : null}
                      </div>
                      <div className='patient_container_left_extra_features'>
                        <div className="extra_features">
                          <div className="extra_features_options">
                            <button id='prescription_section' name="prescripciones" onClick={handleExtraFeatures} className={'button_tag ' + extraFeaturesActive.prescriptions}>{leng.prescripciones}</button>
                            <button id='documents_section' name="documentos" onClick={handleExtraFeatures} className={'button_tag ' + extraFeaturesActive.documents}>{leng.documentos}</button>
                            <button id='visits_section' name="visitas" onClick={handleExtraFeatures} className={'button_tag ' + extraFeaturesActive.visits}>{leng.visitas}</button>
                          </div>
                          <div className="extra_features_container">
                            {extraFeatures}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="patient_container_right">
                      {principalComponent}
                    </div>
                  </div>
            }
          </>
          : null
        }
      </div>
    </>
      : null
  )
}

export default Patient
