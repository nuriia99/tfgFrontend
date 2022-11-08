import { React, useState } from 'react'
import _ from 'lodash'

const DiagnosisList = ({ diagnosis, filterDiagnosis }) => {
  const handleClick = (e) => {
    const id = e.currentTarget.id
    if (active === id) setActive('')
    else setActive(id)
    filterDiagnosis(id)
  }
  const uniqueDiagnosis = new Set()
  diagnosis.forEach((d) => {
    uniqueDiagnosis.add(JSON.stringify(d))
  })

  const [active, setActive] = useState()

  return (
    <>
    {
      [...uniqueDiagnosis].map((item, index) => {
        item = JSON.parse(item)
        return (
          <div key={index} onClick={handleClick} id={item.nombre} className={active === item.nombre ? 'diagnosis_item active' : 'diagnosis_item'}>
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
