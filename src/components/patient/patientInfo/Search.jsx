import { React, useState, useEffect } from 'react'
import useFetch from '../../../hooks/useFetch'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { getLenguage } from '../../../utils/lenguage'
import { useGlobalContext } from '../../../hooks/useGlobalContext'

const Search = ({ type, submit }) => {
  const { globalData, updateData } = useGlobalContext()
  const leng = getLenguage(globalData.lenguage, 'patient')
  const [name, setName] = useState('')
  const { fetchData, data: dataFetch } = useFetch()
  const [data, setData] = useState()
  const [rowSelected, setRowSelected] = useState()
  const messagesPlaceholder = {
    med: leng.searchMessageMed,
    diagnosis: leng.searchMessageDiagnosis,
    schedule: leng.searchSchedule
  }

  const messagesTitle = {
    med: leng.medName,
    diagnosis: leng.diagnosisName,
    schedule: leng.scheduleName
  }

  useEffect(() => {
    if (type === 'med') {
      fetchData('/prescriptions/searchMed/?name=' + name, { role: globalData.role })
    } else if (type === 'diagnosis') {
      fetchData('/prescriptions/searchDiagnosis/?name=' + name)
    } else {
      if (globalData.schedules === null) fetchData('/schedules/getSchedules', { centro: globalData.center })
      else setData(globalData.schedules)
    }
  }, [name])

  useEffect(() => {
    if (dataFetch) setData(dataFetch)
    if (type === 'schedule') updateData({ schedules: data })
  }, [dataFetch])

  const handleClick = (index) => {
    setRowSelected(index)
  }

  return (
    <>
      <div className="search_component">
        <div className="search_component_container">
          {
            data
              ? <>
              <div className="search_component_container_info">
                <div className="exit">
                  <button onClick={() => { submit('') }} className='button_classic'><FontAwesomeIcon className='icon' icon={faArrowRightFromBracket}/></button>
                </div>
                <input placeholder={messagesPlaceholder[type]} type="text" value={name} name="inputName" onChange={({ target }) => setName(target.value)} required="required" autoComplete='false'/>
                <div className="row_header">
                  <p>{messagesTitle[type]}</p>
                </div>
                <div className="rows crossbar">
                  {
                    data.map((med, index) => {
                      return (
                        <div onClick={() => { handleClick(index) }} key={index} className={rowSelected === index ? 'row active' : 'row'}>{med.nombre}</div>
                      )
                    })
                  }
                </div>
                <button onClick={() => { submit(data[rowSelected]) }} className='button_classic'>{leng.escoger}</button>
              </div>
              </>
              : null
          }
        </div>
      </div>
    </>
  )
}

export default Search
