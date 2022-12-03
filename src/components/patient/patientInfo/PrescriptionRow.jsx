import { React } from 'react'
import _ from 'lodash'
import { usePatientContext } from '../../../hooks/usePatientContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

const PrescriptionRow = ({ prescription, deletePres, modPres }) => {
  const { patientData } = usePatientContext()
  const alergias = _.toUpper(patientData.patient.inteligenciaActiva.at(-1))
  const alert = alergias.includes(prescription.principioActivo)

  return (
    <>
      <div onClick={modPres} className={alert ? 'table_row_values name alert' : 'table_row_values name'}>
        {prescription.nombreMedicamento}
      </div>
      <div onClick={modPres} className='table_row_values component'>
        {prescription.principioActivo}
      </div>
      <div onClick={modPres} className='table_row_values frecuencia'>
        {prescription.frecuencia}
      </div>
      <div onClick={modPres} className='table_row_values duracion'>
        {prescription.duracion}
      </div>
      <div className='table_row_values delete'>
        <button type='button' onClick={deletePres} className='delete_prescription_button'><FontAwesomeIcon icon={faTrash}/></button>
      </div>
    </>
  )
}

export default PrescriptionRow
