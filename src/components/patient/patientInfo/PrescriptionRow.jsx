import { React } from 'react'
import _ from 'lodash'
import { usePatientContext } from '../../../hooks/usePatientContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

const PrescriptionRow = ({ prescription, deletePres }) => {
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
      <div className='table_row_values delete'>
        <button type='button' onClick={deletePres} className='delete_prescription_button'><FontAwesomeIcon icon={faTrash}/></button>
      </div>
    </>
  )
}

export default PrescriptionRow
