import { React, useEffect, useState } from 'react'
import useFetch from '../../hooks/useFetch'
import { useGlobalContext } from '../../hooks/useGlobalContext'
import { getLenguage } from '../../utils/lenguage'
import { getHour } from '../../utils/utils'

const Schedule = ({ idSchedule, scheduleDay }) => {
  const { globalData } = useGlobalContext()
  const leng = getLenguage(globalData.lenguage, 'home')

  const [scheduleData, setScheduleData] = useState()

  const { fetchData: fetchDataSearch, data: dataSearch } = useFetch()

  useEffect(() => {
    const searchSchedule = async () => {
      await fetchDataSearch('/schedules/getSchedule/' + idSchedule, { scheduleDay })
    }
    searchSchedule()
  }, [idSchedule, scheduleDay])

  useEffect(() => {
    setScheduleData(dataSearch)
  }, [dataSearch])

  return (
    <div className='schedule'>
      {
        scheduleData
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
          : null
      }
    </div>
  )
}

export default Schedule
