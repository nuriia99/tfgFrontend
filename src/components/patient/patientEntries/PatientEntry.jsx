import { React, useState, useEffect } from 'react'
import { getDate, getFormalName, getHour } from '../../../utils/utils'
import { useGlobalContext } from '../../../hooks/useGlobalContext'
import { getLenguage } from '../../../utils/lenguage'
import _ from 'lodash'
import PatientNote from './PatientNote'
import usePost from '../../../hooks/usePost'

const PatientEntries = ({ entry, clickNote }) => {
  const { globalData } = useGlobalContext()
  const leng = getLenguage(globalData.lenguage, 'patient')
  const lengWorker = globalData.lenguage
  const date = getDate(entry.fecha)
  const hour = getHour(entry.fecha)
  const [originalNotes] = useState(entry.notas)
  const [notes, setNotes] = useState(entry.notas)
  const [visibility, setVisibility] = useState('')
  const [isTranslated, setIsTranslated] = useState(false)

  const { postData: postDataTranslation, data: dataTranslation } = usePost()

  useEffect(() => {
    if (dataTranslation) setNotes(dataTranslation.data)
  }, [dataTranslation])

  useEffect(() => {
    if (lengWorker !== entry.lenguaje) setVisibility(' visible')
  }, [])

  const handleTraduction = async () => {
    if (!isTranslated) {
      await postDataTranslation('/entries/translateEntry', { notas: notes, lengWorker })
      setIsTranslated(true)
    } else {
      setNotes(originalNotes)
      setIsTranslated(false)
    }
  }

  return (
    <>
    {
      notes
        ? <div className="entry">
            <div className="entry_info">
              <div>{date + ' ' + hour + ' ' + _.toUpper(getFormalName(entry.trabajador.id.nombre, entry.trabajador.id.apellido1, entry.trabajador.id.apellido2)) + ' - ' + _.toUpper(entry.trabajador.role)}</div>
              <button onClick={handleTraduction} className={'button_classic' + visibility}>{leng.traducir}</button>
            </div>
            <div className="entry_content">
              {notes.map((note, index) => {
                return <PatientNote clickNote={() => { clickNote(index) }} key={index} note={note}/>
              })}
            </div>
          </div>
        : null
    }
    </>
  )
}

export default PatientEntries
