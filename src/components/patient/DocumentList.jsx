import { React } from 'react'
import { useGlobalContext } from '../../hooks/useGlobalContext'
import { getLenguage } from '../../services/lenguage'
import { getDate } from '../../services/utils'

const DocumentsList = () => {
  const { globalData } = useGlobalContext()
  const leng = getLenguage(globalData.lenguage, 'patient')
  const documents = globalData.patient.documentos

  const openPdf = () => {
    window.open('/app/pdf', '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      <div className="documents">
        <div className="documents_container">
          <div className="documents_container_table">
            <div className="table">
              <div className="table_row">
                <div className="table_row name">{leng.nombreDoc}</div>
                <div className="table_row date">{leng.fechaSubida}</div>
              </div>
              {
                documents.map((doc, index) => {
                  return (
                    <div key={index} onClick={openPdf} className="table_row">
                      <div className='table_row nameValue'>
                        {doc.nombre}
                      </div>
                      <div className='table_row dateValue'>
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
