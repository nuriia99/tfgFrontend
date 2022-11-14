import { React } from 'react'
import { useGlobalContext } from '../../../hooks/useGlobalContext'
import { getLenguage } from '../../../services/lenguage'
import { getDate } from '../../../utils/utils'

const DocumentsList = () => {
  const { globalData } = useGlobalContext()
  const leng = getLenguage(globalData.lenguage, 'patient')
  const documents = globalData.patient.documentos

  const openPdf = (e) => {
    window.open('/app/pdf/docs/' + e.target.getAttribute('name'), '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      <div className="documents">
        <div className="documents_container">
          <div className="documents_container_table">
            <div className="table">
              <div className="table_row">
                <div className="name">{leng.nombreDoc}</div>
                <div className="date">{leng.fechaSubida}</div>
              </div>
              {
                documents.map((doc, index) => {
                  return (
                    <div key={index} onClick={openPdf} className="table_row">
                      <div className='nameValue' name={doc.pdfUrl}>
                        {doc.nombre}
                      </div>
                      <div id={'table_row_' + index} className='dateValue'>
                        {getDate(doc.fechaSubida)}
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
