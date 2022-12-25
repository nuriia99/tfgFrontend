import { React, useEffect, useState } from 'react'
import Navbar from '../../components/navbar/Navbar'
import { useGlobalContext } from '../../hooks/useGlobalContext'
import { useNavigate } from 'react-router-dom'
import SearchForm from '../../components/home/SearchForm'
import { getLenguage } from '../../utils/lenguage'
import Schedule from '../../components/home/Schedule'
import DatePicker from 'react-date-picker'
import Search from '../../components/patient/patientInfo/Search'

const Home = () => {
  const { globalData, updateData } = useGlobalContext()
  const leng = getLenguage(globalData.lenguage, 'home')
  const { worker } = globalData
  const [patients, setPatients] = useState()
  const [agenda, setAgenda] = useState()
  const [scheduleDay, setScheduleDay] = useState(new Date())
  const [selectS, setSelectS] = useState(false)
  const navigate = useNavigate()
  useEffect(() => {
    if (!worker) navigate('/app/login')
    worker.centrosInfo.every(c => {
      if (c.nombre === globalData.center) {
        setAgenda(c.agenda)
        updateData({ schedule: c.agenda })
        return false
      }
      return true
    })
  }, [])

  const handleSearch = (patients) => {
    setPatients(patients)
  }
  const handleClick = (e) => {
    navigate('/app/patients/' + e.currentTarget.id)
  }

  const submitSchedule = (schedule) => {
    if (schedule) {
      setAgenda(schedule._id)
      setScheduleDay(new Date())
    }
    setSelectS(false)
  }

  return (
    worker
      ? <div>
      <Navbar/>
      <div className="home">
        {selectS ? <Search type='schedule' submit={submitSchedule}/> : null}
        <div className="home_container">
          <div className="home_container_left">
            <div className="home_container_left_schedule">
            <span className="home_container_left_schedule_title">{leng.busqueda}</span>
              <div className="home_container_left_schedule_container">
                {leng.visitasDia}
                <DatePicker className='DatePicker' format='dd/MM/yyyy' clearIcon={null} autoFocus={false} onChange={(e) => setScheduleDay(e)} value={scheduleDay} />
                <button onClick={() => setSelectS(true)} id='button_submit_search' className='button_classic'>{leng.cambiarAgenda}</button>
              </div>
            </div>
            <div className="home_container_left_search">
              <SearchForm handleSearch={handleSearch}/>
            </div>
          </div>
          <div className="home_container_right">
              {
                patients
                  ? <div className="table">
                    <div className="table_row">
                      <div className="name">{leng.nombre}</div>
                      <div className="name">{leng.apellido1}</div>
                      <div className="name">{leng.apellido2}</div>
                      <div className="sex">{leng.sexo}</div>
                      <div className="age">{leng.edad}</div>
                    </div>
                    {
                      patients.map((patient, index) => {
                        return (
                          <div key={index} className="table_row" id={patient._id} onClick={handleClick}>
                            <div className="nameValue">{patient.nombre}</div>
                            <div className="nameValue">{patient.apellido1}</div>
                            <div className="nameValue">{patient.apellido2}</div>
                            <div className="sexValue">{patient.sexo}</div>
                            <div className="ageValue">{patient.edad}</div>
                          </div>
                        )
                      })
                    }
                  </div>
                  : <>
                  {
                    agenda
                      ? <div>
                        <Schedule idSchedule={agenda} scheduleDay={scheduleDay} />
                      </div>
                      : null
                  }
                  </>
              }
          </div>
        </div>
      </div>
    </div>
      : null
  )
}

export default Home
