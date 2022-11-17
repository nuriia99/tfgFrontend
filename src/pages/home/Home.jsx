import { React, useEffect, useState } from 'react'
import Navbar from '../../components/navbar/Navbar'
import { useGlobalContext } from '../../hooks/useGlobalContext'
import { useNavigate } from 'react-router-dom'
import SearchForm from '../../components/home/SearchForm'
import { getLenguage } from '../../utils/lenguage'

const Home = () => {
  const { globalData } = useGlobalContext()
  const leng = getLenguage(globalData.lenguage, 'home')
  const { worker } = globalData
  const [patients, setPatients] = useState()
  const navigate = useNavigate()
  useEffect(() => {
    if (!worker) navigate('/app/login')
  }, [])

  const handleSearch = (patients) => {
    setPatients(patients)
  }
  const handleClick = (e) => {
    navigate('/app/patients/' + e.currentTarget.id)
  }
  return (
    worker
      ? <div>
      <Navbar/>
      <div className="home">
        <div className="home_container">
          <div className="home_container_left">
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
                  : null
              }
          </div>
        </div>
      </div>
    </div>
      : null
  )
}// nombre sexo, edad

export default Home
