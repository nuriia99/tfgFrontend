import { React, useState, useEffect } from 'react'
import _ from 'lodash'

const DiagnosisList = ({ diagnosis, filterDiagnosis, updateSelectedDiagnosis }) => {
  const [selectedDiagnosis, setSelectedDiagnosis] = useState()

  useEffect(() => {
    setSelectedDiagnosis(updateSelectedDiagnosis)
  }, [updateSelectedDiagnosis])

  const handleClick = (index) => {
    const name = diagnosis[index].nombre
    if (selectedDiagnosis === name) setSelectedDiagnosis('')
    else setSelectedDiagnosis(name)
    filterDiagnosis(diagnosis[index])
  }

  const uniqueDiagnosis = new Set()
  diagnosis.forEach((d) => {
    uniqueDiagnosis.add(JSON.stringify(d))
  })

  return (
    <>
    {
      [...uniqueDiagnosis].map((item, index) => {
        item = JSON.parse(item)
        return (
          <div key={index} onClick={() => { handleClick(index) }} className={selectedDiagnosis === item.nombre ? 'diagnosis_item active' : 'diagnosis_item'}>
            <div className={'diagnosis_item_color ' + item.severidad}></div>
            <div className="diagnosis_item_name">{_.toUpper(item.nombre)}</div>
          </div>
        )
      })
    }
    </>
  )
}

export default DiagnosisList
