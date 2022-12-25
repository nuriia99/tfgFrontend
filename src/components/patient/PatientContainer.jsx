import { React, useEffect, useState } from 'react'
import { useGlobalContext } from '../../hooks/useGlobalContext'
import { getLenguage } from '../../utils/lenguage'
import { useNavigate, useParams } from 'react-router-dom'
import PatientInfo from './patientInfo/PatientInfo'
import PatientEntries from './patientEntries/PatientEntries'
import PatientActiveIntelligenceCard from './patientInfo/PatientActiveIntelligenceCard'
import PatientActiveIntelligence from './patientInfo/PatientActiveIntelligence'
import PrescriptionCard from './patientInfo/PrescriptionCard'
import PrescriptionList from './patientInfo/PrescriptionList'
import VisitsList from './patientInfo/VisitsList'
import DocumentsCard from './patientInfo/DocumentsCard'
import VisitsCard from './patientInfo/VisitsCard'
import DocumentsList from './patientInfo/DocumentList'
import { usePatientContext } from '../../hooks/usePatientContext'
import useFetch from '../../hooks/useFetch'

const PatientContainer = () => {
  const { globalData } = useGlobalContext()
  const { updatePatientAndAi } = usePatientContext()
  const leng = getLenguage(globalData.lenguage, 'patient')
  const { worker } = globalData
  const [aiPanel, setAiPanel] = useState(false)
  const [extraFeatures, setExtraFeatures] = useState('prescripciones')
  const [principalComponent, setPrincipalComponent] = useState('entries')

  const handleClickAiPanel = () => {
    setAiPanel(!aiPanel)
  }

  const handleExtraFeatures = (e) => {
    const name = e.target.name
    setExtraFeatures(name)
  }

  const handleClickPrincipalComponent = (name) => {
    setPrincipalComponent(() => {
      if (name === 'prescriptions_button') {
        return 'prescriptions'
      } else if (name === 'documents_button') {
        return 'documents'
      } else if (name === 'active_intelligence_button') {
        return 'activeIntelligence'
      } else if (name === 'visits_button') {
        return 'visits'
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
  const { fetchData: fetchDataAi, data: dataAi } = useFetch()

  useEffect(() => {
    fetchDataPatient('/patients/' + patientId)
    fetchDataAi('/patients/' + patientId + '/activeIntelligence')
  }, [])

  useEffect(() => {
    if (dataPatient && dataAi) updatePatientAndAi({ dataPatient, dataAi })
  }, [dataPatient, dataAi])

  return (
    <>
      <div className='patient'>
          {dataPatient && dataAi
            ? <>
              {
                aiPanel
                  ? <PatientActiveIntelligence handleClick={handleClickAiPanel}/>
                  : <div className='patient_container'>
                      <div className='patient_container_left'>
                        <div className='patient_container_left_info'>
                          <PatientInfo handleClickPrincipalComponent={ handleClickPrincipalComponent }/>
                        </div>
                        <div className='patient_container_left_ai'>
                          <PatientActiveIntelligenceCard handleClickPrincipalComponent={ handleClickPrincipalComponent }/>
                        </div>
                        <div className='patient_container_left_extra_features'>
                          <div className="extra_features">
                            <div className="extra_features_options">
                              <button id='prescription_section' name="prescripciones" onClick={handleExtraFeatures} className={extraFeatures === 'prescripciones' ? 'button_tag active' : 'button_tag inactive'}>{leng.prescripciones}</button>
                              <button id='documents_section' name="documentos" onClick={handleExtraFeatures} className={extraFeatures === 'documentos' ? 'button_tag active' : 'button_tag inactive'}>{leng.documentos}</button>
                              <button id='visits_section' name="visitas" onClick={handleExtraFeatures} className={extraFeatures === 'visitas' ? 'button_tag active' : 'button_tag inactive'}>{leng.visitas}</button>
                            </div>
                            <div className="extra_features_container">
                              {
                                {
                                  prescripciones: <PrescriptionCard handleClickPrincipalComponent={ handleClickPrincipalComponent }/>,
                                  documentos: <DocumentsCard handleClickPrincipalComponent={ handleClickPrincipalComponent }/>,
                                  visitas: <VisitsCard handleClickPrincipalComponent={ handleClickPrincipalComponent }/>
                                }[extraFeatures]
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="patient_container_right">
                        {
                          {
                            prescriptions: <PrescriptionList/>,
                            documents: <DocumentsList/>,
                            activeIntelligence: <PatientActiveIntelligence/>,
                            visits: <VisitsList/>,
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
