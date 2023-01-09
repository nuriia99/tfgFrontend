import { React, useEffect, useState } from 'react'
import useFetch from '../../hooks/useFetch'
import { useGlobalContext } from '../../hooks/useGlobalContext'
import { getLenguage } from '../../utils/lenguage'
import { getHour, getName } from '../../utils/utils'
import { useNavigate } from 'react-router-dom'

const Schedule = ({ idSchedule, scheduleDay, isCuap, handleClickNewAppointment }) => {
  const { globalData, updateData } = useGlobalContext()
  const leng = getLenguage(globalData.lenguage, 'home')
  const navigate = useNavigate()

  const [scheduleData, setScheduleData] = useState()

  const { fetchData: fetchDataSearch, data: dataSearch } = useFetch()
  const [selectedRow, setSelectedRow] = useState()

  useEffect(() => {
    const searchSchedule = async () => {
      await fetchDataSearch('/schedules/getSchedule/' + idSchedule, { scheduleDay, isCuap })
    }
    searchSchedule()
  }, [idSchedule, scheduleDay])

  useEffect(() => {
    if (dataSearch) {
      console.log(dataSearch)
      dataSearch.citasPrevias.sort((a, b) => {
        return b.fecha > a.fecha ? -1 : 1
      })
      setScheduleData(dataSearch)
    }
    // setSelectedRow()
  }, [dataSearch])

  const getTime = (dateString) => {
    if (dateString) {
      const currentDate = new Date()
      const date = new Date(dateString)
      date.setHours(date.getHours() - 1)
      const mill = currentDate.getTime() - date.getTime()
      let minutes = Math.floor(mill / 60000)
      let seconds = ((mill % 60000) / 1000).toFixed(0)
      if (seconds === '60') seconds = 0
      minutes = minutes.toString()
      seconds = seconds.toString()
      if (minutes.length < 2) minutes = '0' + minutes
      if (seconds.length < 2) seconds = '0' + seconds
      return minutes + ':' + seconds
    } else return '00:00'
  }

  const handleClickReport = (index) => {
    updateData({ report: scheduleData.visitasUrgencia[index] })
    navigate('/app/patients/informe/' + scheduleData.visitasUrgencia[index].paciente._id)
  }

  const handleClickRow = (cita) => {
    setSelectedRow(cita)
  }

  return (
    <div className='schedule'>
      {
        scheduleData
          ? <>
            {
              !isCuap
                ? <>
                  <div className="classic_table">
                    <table>
                      <tbody>
                        <tr className='schedule_header'>
                          <th className='small'>Hora</th>
                          <th className='big'>{leng.nombreCompleto}</th>
                          <th className='small'>{leng.sexo}</th>
                          <th className='small'>{leng.edad}</th>
                          <th className='big'>T.Vis.</th>
                        </tr>
                        {
                          scheduleData.citasPrevias.map((cita, index) => {
                            return (
                              <tr key={index} onClick={() => handleClickRow(cita)} className={selectedRow && selectedRow._id === cita._id ? 'pair schedule_row' : 'schedule_row'}>
                                <td className='small'>{getHour(cita.fecha)}</td>
                                <td className='big'>{getName(cita.paciente.nombre, cita.paciente.apellido1, cita.paciente.apellido2)}</td>
                                <td className='small'>{cita.paciente.sexo}</td>
                                <td className='small'>{cita.paciente.edad}</td>
                                <td className='big'>{cita.tipoVisita}</td>
                              </tr>
                            )
                          })
                        }
                      </tbody>
                    </table>
                    {
                      scheduleData.citasPrevias.length < 1
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
                              <p>{selectedRow.paciente.cip}</p>
                              <label>DNI: </label>
                              <p>{selectedRow.paciente.dni}</p>
                            </div>
                            <a href={'/app/patients/' + selectedRow.paciente._id}><button className='button_classic'>{leng.cursoClinico}</button></a>
                          </div>
                          <div className="schedule_infoPatient_row">
                            <div className='schedule_infoPatient_row_items'>
                              <label>Direccion: </label>
                              <p>{selectedRow.paciente.direccion}</p>
                              <label>Telefono: </label>
                              <p>{selectedRow.paciente.telefono}</p>
                            </div>
                            <button className='button_classic' onClick={() => handleClickNewAppointment(selectedRow.paciente)}>{leng.consulta}</button>
                          </div>
                        </div>
                      : null
                  }
                </>
                : <div className="classic_table">
                  <table>
                    <thead>
                      <tr>
                        <th className='small'>{leng.horaLlegada}</th>
                        <th>{leng.nombreCompleto}</th>
                        <th className='small'>{leng.sexo}</th>
                        <th className='small'>{leng.edad}</th>
                        <th className='small'>{leng.triaje}</th>
                        <th className='small'>{leng.tiempo}</th>
                        <th className='small'>{leng.tiempoAsistencia}</th>
                        <th>{leng.comentario}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        scheduleData.visitasUrgencia.map((cita, index) => {
                          return (
                              <tr key={index} className={index % 2 ? 'pair schedule_row' : 'schedule_row'}>
                                <td className='small' onClick={() => handleClickReport(index)}>{getHour(cita.fechaEntrada)}</td>
                                <td onClick={() => handleClickReport(index)}>{getName(cita.paciente.nombre, cita.paciente.apellido1, cita.paciente.apellido2)}</td>
                                <td className='small' onClick={() => handleClickReport(index)}>{cita.paciente.sexo}</td>
                                <td className='small' onClick={() => handleClickReport(index)}>{cita.paciente.edad}</td>
                                <td className='small' onClick={() => handleClickReport(index)}>{cita.triaje}</td>
                                <td className='small' onClick={() => handleClickReport(index)}>{getTime(cita.fechaEntrada)}</td>
                                <td className='small' onClick={() => handleClickReport(index)}>{getTime(cita.fechaAsistencia)}</td>
                                <td>{cita.comentario}</td>
                              </tr>
                          )
                        })
                        }
                    </tbody>
                  </table>
                  {
                    scheduleData.visitasUrgencia.length < 1
                      ? <>
                        <div className='empty'>{leng.empty}</div>
                      </>
                      : null
                  }
                </div>
            }
          </>
          : null
      }
    </div>
  )
}

export default Schedule
