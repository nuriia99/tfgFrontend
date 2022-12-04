import { React } from 'react'
import { useGlobalContext } from '../../../hooks/useGlobalContext'
import { usePatientContext } from '../../../hooks/usePatientContext'
import { getLenguage } from '../../../utils/lenguage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

const DocumentsCard = ({ handleClickPrincipalComponent }) => {
  const { globalData } = useGlobalContext()
  const { patientData } = usePatientContext()
  const leng = getLenguage(globalData.lenguage, 'patient')
  const openPdf = (e) => {
    window.open('/app/pdf/docs/' + e.target.getAttribute('name'), '_blank', 'noopener,noreferrer')
  }
  return (
    <div className="panel">
      <div className="panel_row_header">
        <p>{leng.documentosActuales}</p>
        <button id='documents_button' name='prescriptions_button' onClick={() => handleClickPrincipalComponent('documents_button')} className='button_plus'><FontAwesomeIcon id='prescriptions_button' name='prescriptions_button' className='icon' icon={faPlus}/></button>
      </div>
      {
        patientData.patient
          ? <>
            {
              patientData.patient.documentos.map((doc, index) => {
                return (
                  <div key={index} name={doc.pdfUrl} className="panel_row activable" onClick={openPdf}>{doc.nombre}</div>
                )
              })
            }
          </>
          : null
      }
    </div>
  )
}

export default DocumentsCard
