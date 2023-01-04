import { React, useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import useFetch from '../../hooks/useFetch'
import { getName } from '../../utils/utils.js'
import { getLenguage } from '../../utils/lenguage'
import { useGlobalContext } from '../../hooks/useGlobalContext'

const GoalPatients = ({ goal, handleBack }) => {
  const { fetchData, data } = useFetch()
  const { globalData } = useGlobalContext()
  const leng = getLenguage(globalData.lenguage, 'statistics')
  const [pacientes, setPacientes] = useState()
  useEffect(() => {
    fetchData('/goals/getPatientsListGoal', { pacientesTotales: goal.pacientesTotales, pacientesCompletados: goal.pacientesCompletados })
  }, [])
  useEffect(() => {
    if (data) {
      setPacientes(data)
    }
  }, [data])

  return (
    <>
    {
      pacientes
        ? <>
      <div className="listPatients">
        <div className="exit">
          <button onClick={handleBack} className='button_classic'><FontAwesomeIcon className='icon' icon={faArrowRightFromBracket}/></button>
        </div>
        <div className="listPatients_container">
          <div className="listPatients_container_name">
            <h3>{goal.codigo} - {goal.nombre}</h3>
          </div>
          <div className="classic_table no_selected_rows">
            <table>
              <thead>
                <tr>
                  <th>{leng.resuelto}</th>
                  <th>{leng.noResuelto}</th>
                  <th>{leng.pacientes}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{goal.pacientesCompletados.length}</td>
                  <td>{goal.pacientesTotales.length - goal.pacientesCompletados.length}</td>
                  <td>{goal.pacientesTotales.length}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <h4>{leng.listaPacientes}</h4>
          <div className="classic_table">
            <table>
              <thead>
                <tr>
                  <th>{leng.cip}</th>
                  <th>{leng.nombre}</th>
                  <th>{leng.telefono}</th>
                </tr>
              </thead>
              <tbody>
                {
                  pacientes.pacientesACompletarData.map((patient, index) => {
                    return (
                      <tr key={index}>
                        <td><a href={'/app/patients/' + patient._id}>{patient.cip}</a></td>
                        <td><a href={'/app/patients/' + patient._id}>{getName(patient.nombre, patient.apellido1, patient.apellido2)}</a></td>
                        <td><a href={'/app/patients/' + patient._id}>{patient.telefono}</a></td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
            {
              pacientes.pacientesACompletarData.length < 1
                ? <>
                  <div className='empty'>{leng.empty}</div>
                </>
                : null
            }
          </div>
          <h4>{leng.pacientesResueltos}</h4>
          <div className="classic_table">
            <table>
              <thead>
                <tr>
                  <th>{leng.cip}</th>
                  <th>{leng.nombre}</th>
                  <th>{leng.telefono}</th>
                </tr>
              </thead>
              <tbody>
                {
                  pacientes.pacientesCompletadosData.map((patient, index) => {
                    return (
                      <tr key={index}>
                        <td><a href={'/app/patients/' + patient._id}>{patient.cip}</a></td>
                        <td><a href={'/app/patients/' + patient._id}>{getName(patient.nombre, patient.apellido1, patient.apellido2)}</a></td>
                        <td><a href={'/app/patients/' + patient._id}>{patient.telefono}</a></td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
            {
              pacientes.pacientesCompletadosData.length < 1
                ? <>
                  <div className='empty'>{leng.empty}</div>
                </>
                : null
            }
          </div>
        </div>
      </div>
        </>
        : null
    }
    </>
  )
}

export default GoalPatients
