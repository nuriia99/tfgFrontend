import { React } from 'react'
import _ from 'lodash'
import { usePatientContext } from '../../../hooks/usePatientContext'

const PrescriptionRow = ({ prescription }) => {
  const { patientData } = usePatientContext()
  const alergias = _.toUpper(patientData.patient.inteligenciaActiva.at(-1))
  const alert = alergias.includes(prescription.principioActivo)
  return (
    <>
      <div className={alert ? 'table_row_values name alert' : 'table_row_values name'}>
        {prescription.nombreMedicamento}
      </div>
      <div className='table_row_values component'>
        {prescription.principioActivo}
      </div>
      <div className='table_row_values frecuencia'>
        {prescription.frecuencia}
      </div>
      <div className='table_row_values duracion'>
        {prescription.duracion}
      </div>
    </>
  )
}

export default PrescriptionRow
