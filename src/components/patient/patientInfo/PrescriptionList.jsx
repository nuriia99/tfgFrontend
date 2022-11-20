import { React } from 'react'
import { useGlobalContext } from '../../../hooks/useGlobalContext'
import { usePatientContext } from '../../../hooks/usePatientContext'
import { getLenguage } from '../../../utils/lenguage'
import PrescriptionRow from './PrescriptionRow'

// patient={{ allergy: globalData.patient.inteligenciaActiva.alergias, prescriptions: globalData.patient.prescripciones }}
const PrescriptionList = () => {
  const { globalData } = useGlobalContext()
  const { patientData } = usePatientContext()
  const leng = getLenguage(globalData.lenguage, 'patient')
  const allergy = patientData.patient.inteligenciaActiva.at(-1).at(-1)
  const currentDate = new Date()
  const prescriptions = patientData.patient.prescripciones.filter((prescription) => {
    return new Date(prescription.fechaFinal).getTime() > currentDate.getTime()
  })
  return (
    <>
      <div className="prescriptions">
        <div className="prescriptions_container">
          <div className="prescriptions_container_info">
            <div className="prescriptions_container_info_title">
              {leng.alergias + ': '}
            </div>
            {allergy}
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
