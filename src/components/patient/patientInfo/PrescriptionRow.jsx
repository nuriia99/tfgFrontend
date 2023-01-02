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
      <tr className='prescription_row'>
        <td onClick={modPres} className={alert ? 'table_row_values name alert' : 'table_row_values name'}>{prescription.nombreMedicamento}</td>
        <td onClick={modPres}>{prescription.principioActivo}</td>
        <td className='small' onClick={modPres}>{prescription.frecuencia}</td>
        <td className='small' onClick={modPres}>{prescription.duracion}</td>
        <td className='small'><button className='delete_prescription_button' type='button' onClick={deletePres}><FontAwesomeIcon icon={faTrash}/></button></td>
      </tr>
    </>
  )
}

export default PrescriptionRow
