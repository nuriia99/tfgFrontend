import { React, useState, useEffect } from 'react'
import { useGlobalContext } from '../../../hooks/useGlobalContext'
import { usePatientContext } from '../../../hooks/usePatientContext'
// import { getLenguage } from '../../../utils/lenguage'
import { getHour, getName } from '../../../utils/utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import usePost from '../../../hooks/usePost'
import usePatch from '../../../hooks/usePatch'
import { getLenguage } from '../../../utils/lenguage'
import useFetch from '../../../hooks/useFetch'
import Search from './Search'
import SearchForm from '../../home/SearchForm'
import DatePicker from 'react-date-picker'
import { Option, Select } from '../../home/Select'

const AddAppointment = ({ type, quitAddAppointment, modifying, patient }) => {
  const { globalData, updateData } = useGlobalContext()
  const leng = getLenguage(globalData.lenguage, 'patient')
  const { patientData, updatePatient } = usePatientContext()
  // const [error, setError] = useState(null)
  const [appointment, setAppointment] = useState({
    paciente: patientData ? patientData.patient._id : patient._id,
    fecha: new Date(),
    hora: '10:30',
    especialidad: globalData.role,
    agenda: globalData.schedule,
    trabajador: globalData.worker,
    tipoVisita: 'Presencial 15min',
    centro: globalData.center,
    motivo: ''
  })
  const [selectS, setSelectS] = useState(false)
  const [data, setData] = useState()

  useEffect(() => {
    if (patientData) setPatients([patientData.patient])
    else setPatients([patient])
    if (globalData.schedules === null) fetchData('/schedules/getSchedules', { centro: globalData.center })
    else {
      setData(globalData.schedules)
      globalData.schedules.every(s => {
        if (s._id === appointment.agenda) {
          setAppointment(prev => { return ({ ...prev, agenda: s }) })
          return false
        }
        return true
      })
    }
    if (modifying) {
      setAppointment(prev => {
        const date = new Date(modifying.fecha)
        return (
          {
            ...prev,
            paciente: modifying.paciente,
            fecha: modifying.fecha,
            hora: getHour(date),
            trabajador: modifying.trabajador,
            especialidad: modifying.especialidad,
            agenda: modifying.agenda,
            tipoVisita: modifying.tipoVisita,
            centro: modifying.centro,
            motivo: modifying.motivo
          }
        )
      })
    }
  }, [])

  const { postData: postAppointment, data: dataAppointment } = usePost()
  const { patchData, data: dataPatch } = usePatch()
  const { fetchData, data: dataFetch } = useFetch()

  const [error, setError] = useState()

  useEffect(() => {
    if (dataFetch) {
      setData(dataFetch)
      updateData({ schedules: dataFetch })
      dataFetch.every(s => {
        if (s._id === appointment.agenda) {
          setAppointment(prev => { return ({ ...prev, agenda: s }) })
          return false
        }
        return true
      })
    }
  }, [dataFetch])

  const handleChangeShedule = (option) => {
    data.every(s => {
      if (s.nombre === option.nombre) {
        setAppointment(prev => { return ({ ...prev, agenda: s, trabajador: s.trabajador, especialidad: s.especialidad }) })
        return false
      }
      return true
    })
    setSelectS(false)
  }

  const submitAppointment = () => {
    const time = appointment.hora.split(':', 2)
    if (modifying) appointment.fecha = new Date(appointment.fecha)
    appointment.fecha.setHours(parseInt(time[0]) + 1, parseInt(time[1]))
    if (!modifying) postAppointment('/schedules/createAppointment', { appointment })
    else patchData('/schedules/updateAppointment/' + modifying._id, { appointment })
  }
  useEffect(() => {
    if (dataAppointment) {
      if (dataAppointment.data.message) {
        if (dataAppointment.data.message === 'Las fechas se solapan.') setError(leng.errorSolapa)
        else if (dataAppointment.data.message === 'El trabajador no tiene ese turno asignado') setError(leng.errorTurno)
        else setError(leng.errorPasado)
      } else {
        if (patientData) {
          const newPatient = { ...patientData.patient }
          newPatient.citasPrevias.push({ ...appointment, _id: dataAppointment.data._id })
          updatePatient({ patient: newPatient })
        }
        quitAddAppointment()
      }
    }
  }, [dataAppointment])

  useEffect(() => {
    if (dataPatch) {
      if (dataPatch.data.message) {
        if (dataPatch.data.message === 'Las fechas se solapan.') setError(leng.errorSolapa)
        else if (dataPatch.data.message === 'El trabajador no tiene ese turno asignado') setError(leng.errorTurno)
        else setError(leng.errorPasado)
      } else {
        if (patientData) {
          const newPatient = { ...patientData.patient }
          const newAppointments = newPatient.citasPrevias.map((a) => {
            if (a._id === dataPatch.data._id) {
              a = { ...appointment, _id: dataPatch.data._id }
            }
            return a
          })
          newPatient.citasPrevias = newAppointments
          updatePatient({ patient: newPatient })
        }
        quitAddAppointment()
      }
    }
  }, [dataPatch])

  const [patients, setPatients] = useState()
  const handleSearch = (patients) => {
    setPatients(patients)
  }
  const handleClick = (p) => {
    setAppointment(prev => { return ({ ...prev, paciente: p._id }) })
  }

  return (
    <div className="addAppointment">
      {selectS ? <Search type='schedule' submit={handleChangeShedule}/> : null}
      {
        appointment
          ? <>
          <div className="exit_appointment">
            <button onClick={quitAddAppointment} className='button_classic'><FontAwesomeIcon className='icon' icon={faArrowRightFromBracket}/></button>
          </div>
          <div>
            <div className="addAppointment_time">
              <div className='addAppointment_time_item'>
                <label>Hora: </label>
                <input type="time" value={appointment.hora} name="inputTime" onChange={({ target }) => setAppointment((prev) => { return { ...prev, hora: target.value } })} required="required"/>
              </div>
              <div>
                <label>Fecha: </label>
                <DatePicker className='DatePicker' format='dd/MM/yyyy' clearIcon={null} autoFocus={false} onChange={(target) => setAppointment((prev) => { return { ...prev, fecha: target } })} value={appointment.fecha} />
              </div>
            </div>
            <div className='addAppointment_agenda'>
              <label>{leng.seleccionarAgenda}</label>
              <div className="search">
                <div className="med">{appointment.agenda.nombre}</div>
                <button type='button' onClick={() => { setSelectS(true) }} className='search_button'><FontAwesomeIcon icon={faMagnifyingGlass}/></button>
              </div>
            </div>
            <div className='addAppointment_paciente'>
              {
                type !== 'paciente'
                  ? <>
                  <label>Seleccionar paciente: </label>
                  <SearchForm handleSearch={handleSearch} type='appointment'/>
                  </>
                  : <label>Paciente: </label>
              }
              <div className="addAppointment_paciente_list">
                {
                  patients
                    ? <>
                      <div className="classic_table">
                        <table>
                          <thead>
                            <tr>
                              <th className='big'>{leng.nombreCompleto}</th>
                              <th className='big'>CIP</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              patients.map((p, index) => {
                                let select = false
                                if (appointment.paciente === p._id) select = true
                                return <tr key={index} onClick={() => handleClick(p)} className={select ? 'pair' : null}>
                                  <td className='big'>{getName(p.nombre, p.apellido1, p.apellido2)}</td>
                                  <td className='big'>{p.cip}</td>
                                </tr>
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
                    </>
                    : null
                }
              </div>
            </div>
            <div className='addAppointment_motivo'>
              <label>Motivo de la visita: </label>
              <textarea name="motivo" id="" rows="2" onChange={({ target }) => setAppointment((prev) => { return { ...prev, motivo: target.value } })} value={appointment.motivo}></textarea>
              <div className='addAppointment_motivo_tipo'>
                <label>Tipo Visita: </label>
                <Select currentSelect={appointment.tipoVisita} handleChange={(option) => { setAppointment((prev) => { return { ...prev, tipoVisita: option } }) }}>
                  <Option option='Presencial 15min'></Option>
                  <Option option='Presencial 30min'></Option>
                  <Option option='Domicilio'></Option>
                  <Option option='Teléfonica'></Option>
                  <Option option='No presencial'></Option>
                </Select>
              </div>
            </div>
          </div>
          {
            error
              ? <div className="error"><p className="error_message">{error}</p></div>
              : null
          }
          <button onClick={submitAppointment} className='button_classic'>{modifying ? 'Guardar cambios' : 'Crear cita'}</button>
          </>
          : null
      }
    </div>
  )
}

export default AddAppointment
