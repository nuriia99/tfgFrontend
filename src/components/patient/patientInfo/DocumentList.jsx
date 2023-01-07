import { React, useState, useEffect } from 'react'
import { useGlobalContext } from '../../../hooks/useGlobalContext'
import { usePatientContext } from '../../../hooks/usePatientContext'
import { getLenguage } from '../../../utils/lenguage'
import { getDate } from '../../../utils/utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleExclamation, faTrash } from '@fortawesome/free-solid-svg-icons'
import useDelete from '../../../hooks/useDelete'
import useFetch from '../../../hooks/useFetch'
import { jsPDF } from 'jspdf'

const DocumentsList = () => {
  const { globalData } = useGlobalContext()
  const { patientData, updatePatient } = usePatientContext()
  const leng = getLenguage(globalData.lenguage, 'patient')

  const [documentos, setDocumentos] = useState(patientData.patient.documentos)
  const [deleteIndex, setDeleteIndex] = useState()

  const { deleteData, data } = useDelete()
  const { fetchData, data: dataRep } = useFetch()

  useEffect(() => {
    if (data) {
      const newPatient = { ...patientData.patient }
      newPatient.documentos = documentos
      updatePatient({ patient: newPatient })
    }
  }, [data])

  const openPdf = async (d) => {
    await fetchData('/patients/report/download', { patient: patientData.patient.id, document: d._id })
  }
  useEffect(() => {
    if (dataRep) {
      console.log(dataRep)
      // eslint-disable-next-line new-cap
      const pdf = new jsPDF()
      pdf.setProperties({
        title: dataRep.nombre
      })
      pdf.html(htmlTemplate(JSON.parse(dataRep.pdfUrl)), {
        callback: function (pdf) {
          console.log('a')
          pdf.output('dataurlnewwindow')
        },
        x: 15,
        y: 15,
        width: 170,
        windowWidth: 650
      })
    }
  }, [dataRep])

  const htmlTemplate = (report) => {
    return `
    <!doctype html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>PDF Result Template</title>
        </head>
        <body>
          <div class="export">
            <div class="export_title">
              ${report.tradTitle}
            </div>
            <div class="export_first">
              <div class="export_first_patientData">
                <div class="export_first_patientData_row">
                  <label>${report.tradName}:</label>
                  <p>${report.name}</p>
                </div>
                <div class="export_first_patientData_row">
                  <label>CIP : </label>
                  <p>${report.cip}</p>
                  <label>${report.tradNacimiento}</label>
                  <p>${report.nacimiento}</p>
                  <label>${report.tradSexo}</label>
                  <p>${report.sexo}</p>
                </div>
              </div>
            </div>
            <div class="solid"></div>
            <div class="export_second">
              <div class='export_first_center'>${report.center}</div>
              <div class="export_second_dates">
                <label>${report.tradHoraEntrada}:</label>
                <p className='box'>${report.horaEntrada}</p>
                <label>${report.tradHoraAsistencia}:</label>
                <p className='box'>${report.horaAsistencia}</p>
              </div>
              <div class="export_second_visita">
                <label>${report.tradVisitado}:</label>
                <div>
                  <p>${report.visitado}</p>
                </div>
              </div>
            </div>
            <div class="solid"></div>
            <div class="export_second">
              <label>${report.tradAnamnesio}</label>
              <div className='box'>${report.anamnsesio}</div>
            </div>
            <div class="export_second">
              <label>${report.tradExploracion}</label>
              <div className='box'>${report.exploracion}</div>
            </div>
            <div class="export_second">
              <label>${report.tradPruebasComplementarias}</label>
              <div className='box'>${report.pruebasComplementarias}</div>
            </div>
            <div class="export_second">
              <label>${report.tradDiagnositco}</label>
              <div className='box'>${report.diagnostico}</div>
            </div>
            <div class="export_second">
              <label>${report.tradPlanTerapeutico}</label>
              <div className='box'>${report.planTerapeutico}</div>
            </div>
            <div class="solid"></div>
            <div class="firma">
              <label>${report.tradFirma}</label>
              <div>${report.nombreMedico}</div>
              <label>${report.tradNumColegiado}</label>
              <div>${report.numColegiado}</div>
              <label>${report.tradTelefono}</label>
              <div>${report.telefono}</div>
              <label>${report.tradEspecialidad}</label>
              <div>${report.especialidad}</div>
            </div>
          </div>
        </body>
    </html>
      `
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
                        <td onClick={() => openPdf(doc)} name={doc.pdfUrl}>{doc.nombre}</td>
                        <td className={'small date_' + index} onClick={() => openPdf(doc)} name={doc.pdfUrl} >{getDate(doc.fechaSubida)}</td>
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
