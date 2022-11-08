import { React } from 'react'
import { getDate, getHour } from '../../services/utils'
import _ from 'lodash'
import PatientNote from './PatientNote'

const PatientEntries = ({ entry }) => {
  const date = getDate(entry.fecha)
  const hour = getHour(entry.fecha)
  return (
    <>
      <div className="entry">
        <div className="entry_info">{date + ' ' + hour + ' ' + _.toUpper(entry.trabajador.name) + ' - ' + _.toUpper(entry.trabajador.role)}</div>
        <div className="entry_content">
          {entry.notas.map((note, index) => {
            return <PatientNote key={index} note={note}/>
          })}
        </div>
      </div>
    </>
  )
}

export default PatientEntries
