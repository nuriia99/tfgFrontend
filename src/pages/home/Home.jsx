import { React, useEffect, useState } from 'react'
import Navbar from '../../components/navbar/Navbar'
import { useGlobalContext } from '../../hooks/useGlobalContext'
import { useNavigate } from 'react-router-dom'
import SearchForm from '../../components/home/SearchForm'
import { getLenguage } from '../../utils/lenguage'
import Schedule from '../../components/home/Schedule'
import DatePicker from 'react-date-picker'
import Search from '../../components/patient/patientInfo/Search'
import { getName } from '../../utils/utils'
import AddAppointment from '../../components/patient/patientInfo/AddAppointment'
import useFetch from '../../hooks/useFetch'

const Home = () => {
  const { globalData, updateData } = useGlobalContext()
  const leng = getLenguage(globalData.lenguage, 'home')
  const { worker } = globalData
  const [patients, setPatients] = useState()
  const [agenda, setAgenda] = useState()
  const [scheduleDay, setScheduleDay] = useState(new Date())
  const [selectS, setSelectS] = useState(false)
  const [isCUAP, setIsCuap] = useState(false)
  const [selectedRow, setSelectedRow] = useState()
  const [showAddAppointment, setShowAddAppointment] = useState(false)
  const navigate = useNavigate()
  useEffect(() => {
    if (!worker) navigate('/app/login')
    else {
      worker.centrosInfo.every(c => {
        if (c.nombre === globalData.center) {
          setAgenda(c.agenda)
          updateData({ schedule: c.agenda })
          return false
        }
        return true
      })
      const centre = globalData.center.slice(0, 4)
      if (centre === 'CUAP') setIsCuap(true)
      fetchData('/schedules/getSchedules', { centro: globalData.center, name: '' })
    }
  }, [])

  window.onscroll = function (e) {
  }

  const { fetchData, data: dataFetch } = useFetch()
  useEffect(() => {
    if (dataFetch) {
      updateData({ schedules: dataFetch })
    }
  }, [dataFetch])

  const handleSearch = (patients) => {
    setPatients(patients)
    setSelectedRow()
  }

  const submitSchedule = (schedule) => {
    if (schedule) {
      setAgenda(schedule)
      // setScheduleDay(new Date())
      setPatients()
    }
    setSelectS(false)
  }

  const refreshSchedule = () => {
    setScheduleDay(new Date())
    setPatients()
    setSelectedRow()
  }

  const handleClickRow = (paciente) => {
    setSelectedRow(paciente)
  }
  const handleClickNewAppointment = (paciente) => {
    if (paciente._id) setSelectedRow(paciente)
    setShowAddAppointment(true)
  }

  return (
    worker
      ? <div>
      <Navbar/>
      <div className="home">
        {selectS ? <Search type='schedule' submit={submitSchedule}/> : null}
        {
          showAddAppointment
            ? <AddAppointment type='paciente' patient={selectedRow} quitAddAppointment={() => { setShowAddAppointment(false) }}/>
            : <>
            <div className="home_container">
              <div className="home_container_left">
                {
                  agenda
                    ? <>
                      {
                        !isCUAP
                          ? <>
                            <div className="home_container_left_schedule">
                            <span className="home_container_left_schedule_title">{leng.busquedaAgenda}</span>
                              <div className="home_container_left_schedule_container">
                                {leng.visitasDia}
                                <DatePicker className='DatePicker' format='dd/MM/yyyy' clearIcon={null} autoFocus={false} onChange={(e) => setScheduleDay(e)} value={scheduleDay} />
                                <button onClick={() => setSelectS(true)} id='button_submit_search' className='button_classic'>{leng.cambiarAgenda}</button>
                              </div>
                            </div>
                          </>
                          : <div className="home_container_left_schedule">
                              <span className="home_container_left_schedule_title">{leng.busquedaAgenda}</span>
                              <div className="home_container_left_schedule_container">
                                <button onClick={refreshSchedule} id='button_submit_search' className='button_classic'>Refrescar</button>
                              </div>
                          </div>
                      }
                      <div className="home_container_left_search">
                        <SearchForm handleSearch={handleSearch}/>
                      </div>
                    </>
                    : null
                }
              </div>
              <div className="home_container_right">
                  {
                    patients
                      ? <>
                      <div className="classic_table">
                        <table>
                          <thead>
                            <tr>
                              <th className='big'>{leng.nombreCompleto}</th>
                              <th className='small'>{leng.sexo}</th>
                              <th className='small'>{leng.edad}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              patients.map((patient, index) => {
                                return (
                                  <tr key={index} className={selectedRow && selectedRow._id === patient._id ? 'pair schedule_row' : 'schedule_row'} id={patient._id} onClick={() => handleClickRow(patient)}>
                                    <td className="big">{getName(patient.nombre, patient.apellido1, patient.apellido2)}</td>
                                    <td className="small">{patient.sexo}</td>
                                    <td className="small">{patient.edad}</td>
                                  </tr>
                                )
                              })
                            }
                          </tbody>
                        </table>
                        {
                          patients.length < 1
                            ? <>
                              <div className='empty'>{leng.empty}</div>
                            </>
                            : null
                        }
                      </div>
                      {
                        selectedRow
                          ? <div className="schedule_infoPatient">
                              <div className="schedule_infoPatient_row">
                                <div className='schedule_infoPatient_row_items'>
                                  <label>CIP: </label>
                                  <p>{selectedRow.cip}</p>
                                  <label>DNI: </label>
                                  <p>{selectedRow.dni}</p>
                                </div>
                                <a href={'/app/patients/' + selectedRow._id}><button className='button_classic'>{leng.cursoClinico}</button></a>
                              </div>
                              <div className="schedule_infoPatient_row">
                                <div className='schedule_infoPatient_row_items'>
                                  <label>{leng.direccion}</label>
                                  <p>{selectedRow.direccion}</p>
                                  <label>{leng.telefono}</label>
                                  <p>{selectedRow.telefono}</p>
                                </div>
                                <button onClick={handleClickNewAppointment} className='button_classic'>{leng.consulta}</button>
                              </div>
                            </div>
                          : null
                      }
                      </>
                      : <>
                      {
                        agenda
                          ? <Schedule idSchedule={agenda._id} scheduleDay={scheduleDay} isCuap={isCUAP} handleClickNewAppointment={handleClickNewAppointment}/>
                          : null
                      }
                      </>
                  }
              </div>
            </div>
          </>
        }
      </div>
    </div>
      : null
  )
}

export default Home
