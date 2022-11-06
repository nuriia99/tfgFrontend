import { React } from 'react'
import { useGlobalContext } from '../../hooks/useGlobalContext'
import { getLenguage } from '../../services/lenguage'
import PrescriptionRow from './PrescriptionRow'

const PrescriptionList = () => {
  const { globalData } = useGlobalContext()
  const leng = getLenguage(globalData.lenguage, 'patient')
  const allergy = globalData.patient.inteligenciaActiva.alergias
  const prescriptions = globalData.patient.prescripciones
  return (
    <>
      <div className="prescriptions">
        <div className="prescriptions_container">
          <div className="prescriptions_container_info">
            <div className="prescriptions_container_info_title">
              {leng.alergias + ': '}
            </div>
            {allergy.at(-1).value}
          </div>
          <div className="prescriptions_container_table">
            <div className="table">
              <div className="table_row">
                <div className="table_row_title name">{leng.nombreMedicamento}</div>
                <div className="table_row_title component">{leng.principioActivo}</div>
                <div className="table_row_title frecuencia">{leng.frecuencia}</div>
                <div className="table_row_title duracion">{leng.duracion}</div>
              </div>
              {
                prescriptions.map((prescription, index) => {
                  return (
                    <div key={index} className="table_row">
                      <PrescriptionRow prescription={prescription}/>
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

export default PrescriptionList
