import { React, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import useFetch from '../../hooks/useFetch'
import { getName } from '../../utils/utils.js'
import { useNavigate } from 'react-router-dom'
import { getLenguage } from '../../utils/lenguage'
import { useGlobalContext } from '../../hooks/useGlobalContext'

const GoalPatients = ({ goal, handleBack }) => {
  const { fetchData, data } = useFetch()
  const { globalData } = useGlobalContext()
  const leng = getLenguage(globalData.lenguage, 'statistics')
  const [pacientes, setPacientes] = useState()
  const navigate = useNavigate()
  useEffect(() => {
    console.log(goal)
    fetchData('/goals/getPatientsListGoal', { pacientesTotales: goal.pacientesTotales, pacientesCompletados: goal.pacientesCompletados })
  }, [])
  useEffect(() => {
    if (data) {
      setPacientes(data)
    }
  }, [data])
  console.log(pacientes)

  const handleclickPatient = (id) => {
    navigate('/app/patients/' + id)
  }

  return (
    <>
    {
      pacientes
        ? <>
<div className="goalListPatients">
        <div className="exit">
          <button onClick={handleBack} className='button_classic'><FontAwesomeIcon className='icon' icon={faArrowRightFromBracket}/></button>
        </div>
        <div className="goalListPatients_container">
          <div className="goalListPatients_container_name">
            <h3>{goal.codigo} - {goal.nombre}</h3>
          </div>
          <div className="goalListPatients_container_row">
            <div className="res">{leng.resuelto}</div>
            <div className="no_res">{leng.noResuelto}</div>
            <div className="total">{leng.pacientes}</div>
          </div>
          <div className="goalListPatients_container_row values">
            <div className="res">{goal.pacientesCompletados.length}</div>
            <div className="no_res">{goal.pacientesTotales.length - goal.pacientesCompletados.length}</div>
            <div className="total">{goal.pacientesTotales.length}</div>
          </div>
          <h4>Lista de pacientes</h4>
          <div className="goalListPatients_container_row2">
            <div className="cip">{leng.cip}</div>
            <div className="name">{leng.nombre}</div>
            <div className="telephone">{leng.telefono}</div>
          </div>
          {
            pacientes.pacientesACompletarData.map((patient, index) => {
              return (
                <div onClick={() => { handleclickPatient(patient._id) }} key={index} className="goalListPatients_container_row2 values">
                  <div className="cip">{patient.cip}</div>
                  <div className="name">{getName(patient.nombre, patient.apellido1, patient.apellido2)}</div>
                  <div className="telephone">{patient.telefono}</div>
                </div>
              )
            })
          }
          <h4>Pacientes resueltos</h4>
          <div className="goalListPatients_container_row2">
            <div className="cip">{leng.cip}</div>
            <div className="name">{leng.nombre}</div>
            <div className="telephone">{leng.telefono}</div>
          </div>
          {
            pacientes.pacientesCompletadosData.map((patient, index) => {
              return (
                <div onClick={() => { handleclickPatient(patient._id) }} key={index} className="goalListPatients_container_row2 values">
                  <div className="cip">{patient.cip}</div>
                  <div className="name">{getName(patient.nombre, patient.apellido1, patient.apellido2)}</div>
                  <div className="telephone">{patient.telefono}</div>
                </div>
              )
            })
          }
        </div>
      </div>
        </>
        : null
    }
    </>
  )
}

export default GoalPatients
