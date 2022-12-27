import { React, useEffect, useState } from 'react'
import useFetch from '../../hooks/useFetch'
import { useGlobalContext } from '../../hooks/useGlobalContext'
import { getLenguage } from '../../utils/lenguage'
import { getHour, getName } from '../../utils/utils'

const Schedule = ({ idSchedule, scheduleDay, isCuap }) => {
  const { globalData } = useGlobalContext()
  const leng = getLenguage(globalData.lenguage, 'home')

  const [scheduleData, setScheduleData] = useState()

  const { fetchData: fetchDataSearch, data: dataSearch } = useFetch()

  useEffect(() => {
    const searchSchedule = async () => {
      await fetchDataSearch('/schedules/getSchedule/' + idSchedule, { scheduleDay, isCuap })
    }
    searchSchedule()
  }, [idSchedule, scheduleDay])

  useEffect(() => {
    setScheduleData(dataSearch)
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

  return (
    <div className='schedule'>
      {
        scheduleData
          ? <>
            {
              !isCuap
                ? <>
                  <div className='schedule_table'>
                    <table>
                      <tbody>
                        <tr>
                          <th className='small'>Hora</th>
                          <th className='big'>{leng.nombre}</th>
                          <th className='big'>{leng.apellido1}</th>
                          <th className='big'>{leng.apellido2}</th>
                          <th className='small'>{leng.sexo}</th>
                          <th className='small'>{leng.edad}</th>
                          <th className='small'>T.Vis.</th>
                        </tr>
                        {
                          scheduleData.citasPrevias.map((cita, index) => {
                            return (
                              <tr key={index} className={index % 2 ? 'pair' : null}>
                                <td><a href={'/app/patients/' + cita.paciente._id}>{getHour(cita.fecha)}</a></td>
                                <td><a href={'/app/patients/' + cita.paciente._id}>{cita.paciente.nombre}</a></td>
                                <td><a href={'/app/patients/' + cita.paciente._id}>{cita.paciente.apellido1}</a></td>
                                <td><a href={'/app/patients/' + cita.paciente._id}>{cita.paciente.apellido2}</a></td>
                                <td><a href={'/app/patients/' + cita.paciente._id}>{cita.paciente.sexo}</a></td>
                                <td><a href={'/app/patients/' + cita.paciente._id}>{cita.paciente.edad}</a></td>
                                <td><a href={'/app/patients/' + cita.paciente._id}>{cita.tipoVisita}</a></td>
                              </tr>
                            )
                          })
                        }
                      </tbody>
                    </table>
                  </div>
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
                              <tr key={index} className={index % 2 ? 'pair' : null}>
                                <td className='small'><a href={'/app/patients/' + cita.paciente._id}>{getHour(cita.fechaEntrada)}</a></td>
                                <td><a href={'/app/patients/' + cita.paciente._id}>{getName(cita.paciente.nombre, cita.paciente.apellido1, cita.paciente.apellido2)}</a></td>
                                <td className='small'><a href={'/app/patients/' + cita.paciente._id}>{cita.paciente.sexo}</a></td>
                                <td className='small'><a href={'/app/patients/' + cita.paciente._id}>{cita.paciente.edad}</a></td>
                                <td className='small'><a href={'/app/patients/' + cita.paciente._id}>{cita.triaje}</a></td>
                                <td className='small'><a href={'/app/patients/' + cita.paciente._id}>{getTime(cita.fechaEntrada)}</a></td>
                                <td className='small'><a href={'/app/patients/' + cita.paciente._id}>{getTime(cita.fechaAsistencia)}</a></td>
                                <td><a href={'/app/patients/' + cita.paciente._id}>{cita.comentario}</a></td>
                              </tr>
                          )
                        })
                        }
                    </tbody>
                  </table>
                </div>
            }
          </>
          : null
      }
    </div>
  )
}

export default Schedule
