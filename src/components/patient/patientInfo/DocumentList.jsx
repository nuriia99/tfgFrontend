import { React, useState, useEffect } from 'react'
import { useGlobalContext } from '../../../hooks/useGlobalContext'
import { usePatientContext } from '../../../hooks/usePatientContext'
import { getLenguage } from '../../../utils/lenguage'
import { getDate } from '../../../utils/utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import useDelete from '../../../hooks/useDelete'
import axios from 'axios'
import { saveAs } from 'file-saver'

const DocumentsList = () => {
  const { globalData } = useGlobalContext()
  const { patientData, updatePatient } = usePatientContext()
  const leng = getLenguage(globalData.lenguage, 'patient')
  console.log(patientData.patient)
  const [documentos, setDocumentos] = useState(patientData.patient.documentos)

  const openPdf = (e) => {
    const params = { reportName: e.target.getAttribute('name') }
    const requestOptions = {
      responseType: 'blob',
      headers: { Authorization: `Bearer ${globalData.token}` },
      params
    }
    axios.get('/patients/report/download', requestOptions
    )
      .then((res) => {
        const pdf = new Blob([res.data], { type: 'application/pdf' })
        // window.open(pdf, '_blank', 'noopener,noreferrer')
        saveAs(pdf, e.target.getAttribute('name'))
      })
  }

  const { deleteData, data } = useDelete()
  const deleteDoc = (index) => {
    deleteData('/patients/' + patientData.patient._id + '/deleteDoc/' + documentos[index]._id, { reportName: documentos[index].pdfUrl })
    setDocumentos(() => {
      const arr = [...documentos]
      arr.splice(index, 1)
      return arr
    })
  }

  useEffect(() => {
    if (data) {
      const newPatient = { ...patientData.patient }
      newPatient.documentos = documentos
      updatePatient({ patient: newPatient })
    }
  }, [data])

  return (
    <>
      <div className="documents">
        <div className="documents_container">
          <div className="documents_container_table">
            <div className="table">
              <div className="table_row">
                <div className="table_row_title name">{leng.nombreDoc}</div>
                <div className="table_row_title date">{leng.fechaSubida}</div>
                <div className="table_row_title delete"></div>
              </div>
              {
                documentos.map((doc, index) => {
                  return (
                    <div key={index} className="table_row">
                      <div className='table_row_values nameValue' onClick={openPdf} name={doc.pdfUrl}>
                        {doc.nombre}
                      </div>
                      <div id={'table_row_' + index} onClick={openPdf} name={doc.pdfUrl} className='table_row_values dateValue'>
                        {getDate(doc.fechaSubida)}
                      </div>
                      <div className='table_row_values delete'>
                        <button type='button' onClick={() => { deleteDoc(index) }} className='delete_prescription_button'><FontAwesomeIcon icon={faTrash}/></button>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DocumentsList
