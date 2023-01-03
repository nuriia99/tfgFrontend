import { React } from 'react'
import { useGlobalContext } from '../../../hooks/useGlobalContext'
import { usePatientContext } from '../../../hooks/usePatientContext'
import { getLenguage } from '../../../utils/lenguage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'

const DocumentsCard = ({ handleClickPrincipalComponent }) => {
  const { globalData } = useGlobalContext()
  const { patientData } = usePatientContext()
  const leng = getLenguage(globalData.lenguage, 'patient')
  const openPdf = (name) => {
    const params = { reportName: name }
    const requestOptions = {
      responseType: 'blob',
      headers: { Authorization: `Bearer ${globalData.token}` },
      params
    }
    axios.get('/patients/report/download', requestOptions
    )
      .then((res) => {
        const pdf = new Blob([res.data], { type: 'application/pdf' })
        const url = URL.createObjectURL(pdf)
        window.open(url, '_blank', 'noopener,noreferrer')
      })
  }
  return (
    <div className="panel">
      <div className="classic_table">
        <table>
          <thead>
            <tr>
              <th>
              <div className='row'>
                <p>{leng.documentosActuales}</p>
                <button id='documents_button' name='prescriptions_button' onClick={() => handleClickPrincipalComponent('documents_button')} className='button_plus'><FontAwesomeIcon id='prescriptions_button' name='prescriptions_button' className='icon' icon={faPlus}/></button>
              </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {
              patientData.patient
                ? <>
                  {
                    patientData.patient.documentos.map((doc, index) => {
                      return (
                        <tr key={index} onClick={() => openPdf(doc.pdfUrl)}>
                          <td>{doc.nombre}</td>
                        </tr>
                      )
                    })
                  }
                </>
                : null
            }
          </tbody>
        </table>
        {
          patientData.patient.documentos.length < 1
            ? <>
              <div className='empty'>{leng.empty}</div>
            </>
            : null
        }
      </div>
    </div>
  )
}

export default DocumentsCard
