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
  const [activeSchedules, setActiveSchedules] = useState([])
  const [inactiveSchedules, setInactiveSchedules] = useState([])
  const [rowSelected, setRowSelected] = useState()
  const [rowSelectedActive, setRowSelectedActive] = useState()
  const [rowSelectedInactive, setRowSelectedInactive] = useState()
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
      fetchData('/schedules/getSchedules', { centro: globalData.center, name })
    }
  }, [name])

  const splitSchedules = (schedules) => {
    setData(schedules)
    const newActiveSchedules = []
    const newInactiveSchedules = []
    const currentDate = new Date()
    schedules.forEach(s => {
      let isActive = false
      if (s.trabajador._id === globalData.worker._id) {
        s.citasPrevias.every(c => {
          const appointmentDate = new Date(c.fecha)
          if (currentDate.getFullYear() === appointmentDate.getFullYear() && currentDate.getMonth() === appointmentDate.getMonth() && currentDate.getDate() === appointmentDate.getDate()) {
            isActive = true
            return false
          }
          return true
        })
      }
      if (isActive) newActiveSchedules.push(s)
      else newInactiveSchedules.push(s)
    })
    setActiveSchedules(newActiveSchedules)
    setInactiveSchedules(newInactiveSchedules)
  }

  useEffect(() => {
    if (dataFetch) {
      setData(dataFetch)
      if (type === 'schedule') {
        updateData({ schedules: dataFetch })
        splitSchedules(dataFetch)
      }
    }
  }, [dataFetch])

  const handleClick = (index) => {
    setRowSelected(index)
  }

  const handleClickActive = (index) => {
    setRowSelectedActive(index)
    setRowSelectedInactive()
  }

  const handleClickInactive = (index) => {
    setRowSelectedInactive(index)
    setRowSelectedActive()
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
                  {
                    type !== 'schedule'
                      ? <>
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
                      </>
                      : <>
                        <div className="row_header">
                          <p>Agenda activa</p>
                        </div>
                        <div className="rows crossbar">
                          {
                            activeSchedules.map((med, index) => {
                              return (
                                <div onClick={() => { handleClickActive(index) }} key={index} className={rowSelectedActive === index ? 'row active' : 'row'}>{med.nombre}</div>
                              )
                            })
                          }
                        </div>
                        <br />
                        <div className="row_header">
                          <p>{leng.otrasAgendas}</p>
                        </div>
                        <div className="rows crossbar">
                          {
                            inactiveSchedules.map((med, index) => {
                              return (
                                <div onClick={() => { handleClickInactive(index) }} key={index} className={rowSelectedInactive === index ? 'row active' : 'row'}>{med.nombre}</div>
                              )
                            })
                          }
                        </div>
                        <button onClick={() => { submit(rowSelectedActive !== undefined ? activeSchedules[rowSelectedActive] : inactiveSchedules[rowSelectedInactive]) }} className='button_classic'>{leng.escoger}</button>
                      </>
                }
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
