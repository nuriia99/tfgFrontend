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
  console.log(globalData.schedules)

  useEffect(() => {
    if (type === 'med') {
      fetchData('/prescriptions/searchMed/?name=' + name, { role: globalData.role })
    } else if (type === 'diagnosis') {
      fetchData('/prescriptions/searchDiagnosis/?name=' + name)
    } else {
      if (globalData.schedules === null || name !== '') fetchData('/schedules/getSchedules', { centro: globalData.center, name })
      else {
        updateData({ schedules: dataFetch })
        splitSchedules(globalData.schedules)
      }
    }
  }, [name])

  const splitSchedules = (schedules) => {
    setData(schedules)
    const newActiveSchedules = []
    const newInactiveSchedules = []
    const currentDate = new Date()
    schedules.forEach(s => {
      let isActive = false
      if (s.trabajador === null || s.trabajador._id === globalData.worker._id) {
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
                        <div className="table">
                          <div className="classic_table">
                            <table>
                              <thead>
                                <tr>
                                  <th><p>{messagesTitle[type]}</p></th>
                                </tr>
                              </thead>
                              <tbody>
                                {
                                  data.map((med, index) => {
                                    return (
                                      <tr key={index} onClick={() => { handleClick(index) }} className={rowSelected === index ? 'pair med_row' : 'med_row'}>
                                        <td>{med.nombre}</td>
                                      </tr>
                                    )
                                  })
                                }
                              </tbody>
                            </table>
                            {
                              data.length < 1
                                ? <>
                                  <div className='empty'>{leng.empty}</div>
                                </>
                                : null
                            }
                          </div>
                        </div>
                        <button onClick={() => { submit(data[rowSelected]) }} className='button_classic'>{leng.escoger}</button>
                      </>
                      : <>
                        <div className='tables'>
                          <div className="classic_table">
                            <table>
                              <thead>
                                <tr>
                                  <th>Agenda activa</th>
                                </tr>
                              </thead>
                              <tbody>
                                {
                                  activeSchedules.map((schedule, index) => {
                                    return (
                                      <tr onClick={() => { handleClickActive(index) }} key={index} className={rowSelectedActive === index ? 'pair' : null}>
                                        <td>{schedule.nombre}</td>
                                      </tr>
                                    )
                                  })
                                }
                              </tbody>
                            </table>
                            {
                              activeSchedules.length < 1
                                ? <>
                                  <div className='empty'>{leng.empty}</div>
                                </>
                                : null
                            }
                          </div>
                          <div className="classic_table">
                            <table>
                              <thead>
                                <tr>
                                  <th>{leng.otrasAgendas}</th>
                                </tr>
                              </thead>
                              <tbody>
                                {
                                  inactiveSchedules.map((schedule, index) => {
                                    return (
                                      <tr onClick={() => { handleClickInactive(index) }} key={index} className={rowSelectedInactive === index ? 'pair' : null}>
                                        <td>{schedule.nombre}</td>
                                      </tr>
                                    )
                                  })
                                }
                              </tbody>
                            </table>
                            {
                              inactiveSchedules.length < 1
                                ? <>
                                  <div className='empty'>{leng.empty}</div>
                                </>
                                : null
                            }
                          </div>
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
