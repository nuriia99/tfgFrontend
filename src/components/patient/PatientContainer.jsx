import { React, useEffect, useState } from 'react'
import { useGlobalContext } from '../../hooks/useGlobalContext'
import { getLenguage } from '../../services/lenguage'
import { useNavigate, useParams } from 'react-router-dom'
import PatientInfo from './patientInfo/PatientInfo'
import PatientEntries from './patientEntries/PatientEntries'
import PatientActiveIntelligenceCard from './patientInfo/PatientActiveIntelligenceCard'
import PatientActiveIntelligence from './patientInfo/PatientActiveIntelligence'
import PrescriptionCard from './patientInfo/PrescriptionCard'
import PrescriptionList from './patientInfo/PrescriptionList'
import DocumentsCard from './patientInfo/DocumentsCard'
import VisitsCard from './patientInfo/VisitsCard'
import DocumentsList from './patientInfo/DocumentList'
import { usePatientContext } from '../../hooks/usePatientContext'
import useFetch from '../../hooks/useFetch'

const PatientContainer = () => {
  const { globalData } = useGlobalContext()
  const { updatePatient, updateEntries } = usePatientContext()
  const leng = getLenguage(globalData.lenguage, 'patient')
  const { worker } = globalData
  const [aiPanel, setAiPanel] = useState(false)
  const [extraFeatures, setExtraFeatures] = useState('prescripciones')
  const [extraFeaturesActive, setextraFeaturesActive] = useState({
    prescriptions: 'active',
    documents: 'inactive',
    visits: 'inactive'
  })
  const [principalComponent, setPrincipalComponent] = useState('entries')

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
        return 'prescriptions'
      } else if (name === 'documents_button') {
        return 'documents'
      }
      return 'entries'
    })
  }

  const navigate = useNavigate()
  useEffect(() => {
    if (!worker) navigate('/app/login')
  }, [])
  const { id: patientId } = useParams()

  const { fetchData: fetchDataPatient, data: dataPatient } = useFetch()
  const { fetchData: fetchDataEntries, data: dataEntries } = useFetch()
  const { fetchData: fetchDataAi, data: dataAi } = useFetch()

  useEffect(() => {
    const fetchData = async () => {
      await fetchDataPatient('/patients/' + patientId)
      await fetchDataEntries('/entries/patient/' + patientId)
      await fetchDataAi('/patients/' + patientId + '/activeIntelligence')
    }
    fetchData()
  }, [])

  useEffect(() => {
    updatePatient(dataPatient)
    updateEntries(dataEntries)
  }, [dataPatient, dataEntries])

  return (
    <>
      <div className='patient'>
          {dataPatient && dataEntries && dataAi
            ? <>
              {
                aiPanel
                  ? <PatientActiveIntelligence ai={dataAi} handleClick={handleClickAiPanel}/>
                  : <div className='patient_container'>
                      <div className='patient_container_left'>
                        <div className='patient_container_left_info'>
                          <PatientInfo handleClickPrincipalComponent={ handleClickPrincipalComponent }/>
                        </div>
                        <div className='patient_container_left_ai'>
                          <PatientActiveIntelligenceCard handleClick={handleClickAiPanel}/>
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
                        {
                          {
                            prescriptions: <PrescriptionList/>,
                            documents: <DocumentsList/>,
                            entries: <PatientEntries/>
                          }[principalComponent]
                        }
                      </div>
                    </div>
              }
            </>
            : null
          }
        </div>
    </>
  )
}

export default PatientContainer
