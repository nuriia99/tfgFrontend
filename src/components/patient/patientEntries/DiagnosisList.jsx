import { React, useState } from 'react'
import _ from 'lodash'

const DiagnosisList = ({ diagnosis, filterDiagnosis }) => {
  const [selectedDiagnosis, setSelectedDiagnosis] = useState()

  const handleClick = (e) => {
    const id = e.currentTarget.id
    if (selectedDiagnosis === id) setSelectedDiagnosis('')
    else setSelectedDiagnosis(id)
    filterDiagnosis(id)
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
          <div key={index} onClick={handleClick} id={item.nombre} className={selectedDiagnosis === item.nombre ? 'diagnosis_item active' : 'diagnosis_item'}>
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
