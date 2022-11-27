import { React, useState, useEffect } from 'react'
import { useGlobalContext } from '../../../hooks/useGlobalContext'
import { usePatientContext } from '../../../hooks/usePatientContext'
import { getLenguage } from '../../../utils/lenguage'
import { getDate } from '../../../utils/utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import useDelete from '../../../hooks/useDelete'

const DocumentsList = () => {
  const { globalData } = useGlobalContext()
  const { patientData, updatePatient } = usePatientContext()
  const leng = getLenguage(globalData.lenguage, 'patient')
  const documents = patientData.patient.documentos

  const openPdf = (e) => {
    window.open('/app/pdf/docs/' + e.target.getAttribute('name'), '_blank', 'noopener,noreferrer')
  }

  const { deleteData, data } = useDelete()

  const [newDocs, setNewDocs] = useState()

  const deleteDoc = (index) => {
    console.log(documents[index])
    deleteData('/patients/' + patientData.patient._id + '/deleteDoc/' + documents[index]._id)
    setNewDocs(() => {
      const arr = [...patientData.patient.documentos]
      arr.splice(index, 1)
      return arr
    })
  }

  useEffect(() => {
    if (data) {
      const newPatient = { ...patientData.patient }
      newPatient.documentos = newDocs
      updatePatient(newPatient)
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
                documents.map((doc, index) => {
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
