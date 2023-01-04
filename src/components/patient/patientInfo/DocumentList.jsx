import { React, useState, useEffect } from 'react'
import { useGlobalContext } from '../../../hooks/useGlobalContext'
import { usePatientContext } from '../../../hooks/usePatientContext'
import { getLenguage } from '../../../utils/lenguage'
import { getDate } from '../../../utils/utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleExclamation, faTrash } from '@fortawesome/free-solid-svg-icons'
import useDelete from '../../../hooks/useDelete'
import axios from 'axios'

const DocumentsList = () => {
  const { globalData } = useGlobalContext()
  const { patientData, updatePatient } = usePatientContext()
  const leng = getLenguage(globalData.lenguage, 'patient')

  const [documentos, setDocumentos] = useState(patientData.patient.documentos)
  const [deleteIndex, setDeleteIndex] = useState()

  const { deleteData, data } = useDelete()

  useEffect(() => {
    if (data) {
      const newPatient = { ...patientData.patient }
      newPatient.documentos = documentos
      updatePatient({ patient: newPatient })
    }
  }, [data])

  const openPdf = (e) => {
    const params = { reportName: e.target.getAttribute('name') }
    const requestOptions = {
      responseType: 'blob',
      headers: { Authorization: `Bearer ${globalData.token}` },
      params
    }
    axios.get('https://tfg-sistema-sanitario-upc-backend.onrender.com/patients/report/download', requestOptions
    )
      .then((res) => {
        const pdf = new Blob([res.data], { type: 'application/pdf' })
        const url = URL.createObjectURL(pdf)
        window.open(url, '_blank', 'noopener,noreferrer')
      })
  }

  const deleteDoc = () => {
    const index = deleteIndex
    deleteData('/patients/' + patientData.patient._id + '/deleteDoc/' + documentos[index]._id, { reportName: documentos[index].pdfUrl })
    setDocumentos(() => {
      const arr = [...documentos]
      arr.splice(index, 1)
      return arr
    })
    setDeleteIndex()
  }

  return (
    <>
      <div className="documents">
        {
          deleteIndex || deleteIndex === 0
            ? <>
              <div className="overlay">
                <div className="overlay_box">
                  <FontAwesomeIcon icon={faCircleExclamation} className='icon'/>
                  <p>{leng.seguroDocumento}</p>
                  <div className="overlay_box_buttons">
                    <button type='button' onClick={deleteDoc} className='button_classic accept'>Eliminar</button>
                    <button type='button' onClick={() => setDeleteIndex()} className='button_classic cancel'>{leng.cancelar}</button>
                  </div>
                </div>
              </div>
            </>
            : null
        }
        <div className="documents_container">
          <div className="documents_container_table">
            <div className="classic_table">
              <table>
                <thead>
                  <tr>
                    <th>{leng.nombreDoc}</th>
                    <th className='small'>{leng.fechaSubida}</th>
                    <th className='small'></th>
                  </tr>
                </thead>
                <tbody>
                {
                  documentos.map((doc, index) => {
                    return (
                      <tr className='documents_row' key={index}>
                        <td onClick={openPdf} name={doc.pdfUrl}>{doc.nombre}</td>
                        <td className={'small date_' + index} onClick={openPdf} name={doc.pdfUrl} >{getDate(doc.fechaSubida)}</td>
                        <td className='small' onClick={() => { setDeleteIndex(index) }}><button type='button' className='delete_prescription_button'><FontAwesomeIcon icon={faTrash}/></button></td>
                      </tr>
                    )
                  })
                }
                </tbody>
              </table>
              {
                documentos.length < 1
                  ? <>
                    <div className='empty'>{leng.empty}</div>
                  </>
                  : null
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DocumentsList
