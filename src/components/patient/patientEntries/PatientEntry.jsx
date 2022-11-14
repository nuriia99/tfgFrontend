import { React, useState, useEffect } from 'react'
import { getDate, getHour } from '../../../utils/utils'
import { useGlobalContext } from '../../../hooks/useGlobalContext'
import { getLenguage } from '../../../services/lenguage'
import _ from 'lodash'
import PatientNote from './PatientNote'
import { translateNotes } from '../../../services/entries'

const PatientEntries = ({ entry }) => {
  const { globalData } = useGlobalContext()
  const leng = getLenguage(globalData.lenguage, 'patient')
  const lengWorker = globalData.lenguage
  const date = getDate(entry.fecha)
  const hour = getHour(entry.fecha)
  const [notes, setNotes] = useState(entry.notas)
  const [visibility, setVisibility] = useState('')

  useEffect(() => {
    if (lengWorker !== entry.lenguaje) setVisibility(' visible')
  }, [])

  const handleTraduction = async () => {
    const newNotes = await translateNotes({ notes, lengWorker })
    setNotes(newNotes)
  }
  return (
    <>
    {
      notes
        ? <div className="entry">
            <div className="entry_info">
              <div>{date + ' ' + hour + ' ' + _.toUpper(entry.trabajador.name) + ' - ' + _.toUpper(entry.trabajador.role)}</div>
              <button onClick={handleTraduction} className={'button_classic' + visibility}>{leng.traducir}</button>
            </div>
            <div className="entry_content">
              {notes.map((note, index) => {
                return <PatientNote key={index} note={note}/>
              })}
            </div>
          </div>
        : null
    }
    </>
  )
}

export default PatientEntries