import { React } from 'react'
import { useGlobalContext } from '../../../hooks/useGlobalContext'
import _ from 'lodash'

const PrescriptionRow = ({ prescription }) => {
  const { globalData } = useGlobalContext()
  const alergias = _.toUpper(globalData.patient.inteligenciaActiva.alergias.at(-1).value)
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
