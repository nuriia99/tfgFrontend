import { React, useState, useEffect } from 'react'
import { useGlobalContext } from '../../../hooks/useGlobalContext'
import { usePatientContext } from '../../../hooks/usePatientContext'
// import { getLenguage } from '../../../utils/lenguage'
import { getName } from '../../../utils/utils'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import usePost from '../../../hooks/usePost'
import usePatch from '../../../hooks/usePatch'
import { getLenguage } from '../../../utils/lenguage'
import useFetch from '../../../hooks/useFetch'
import Search from './Search'
import SearchForm from '../../home/SearchForm'
import DatePicker from 'react-date-picker'

const AddAppointment = ({ diagnosis, quitAddAppointment, addPrescription, modifying }) => {
  const { globalData } = useGlobalContext()
  const leng = getLenguage(globalData.lenguage, 'patient')
  const { patientData, updatePatient } = usePatientContext()
  // const [error, setError] = useState(null)
  const [appointment, setAppointment] = useState({
    paciente: patientData.patient._id,
    fecha: new Date(),
    hora: '10:30',
    trabajador: globalData.worker._id,
    especialidad: globalData.role,
    agenda: globalData.schedule,
    agendaNombre: '',
    tipoDeVisita: 'D',
    centro: globalData.centre,
    motivo: ''
  })
  const [selectS, setSelectS] = useState(false)
  const [data, setData] = useState()

  console.log(appointment)

  useEffect(() => {
    console.log(patientData)
    if (patientData) setPatients([patientData.patient])
    if (globalData.schedules === null) fetchData('/schedules/getSchedules', { centro: globalData.center })
    else {
      setData(globalData.schedules)
      globalData.schedules.every(s => {
        if (s._id === appointment.agenda) {
          setAppointment(prev => { return ({ ...prev, nombreAgenda: s.nombre }) })
          return false
        }
        return true
      })
    }
    if (modifying) {
      setAppointment(prev => {
        return (
          {
            ...prev,
            paciente: modifying.paciente,
            fecha: modifying.fecha,
            hora: modifying.hora,
            trabajador: modifying.trabajador,
            especialidad: modifying.especialidad,
            agenda: modifying.agenda,
            agendaNombre: '',
            tipoDeVisita: modifying.tipoDeVisita,
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

  useEffect(() => {
    if (dataFetch) {
      setData(dataFetch)
      data.every(s => {
        if (s._id === appointment.agenda) {
          setAppointment(prev => { return ({ ...prev, nombreAgenda: s.nombre }) })
          return false
        }
        return true
      })
    }
  }, [dataFetch])

  const handleChangeShedule = (option) => {
    data.every(s => {
      if (s.nombre === option) {
        setAppointment(prev => { return ({ ...prev, agenda: s._id, agendaNombre: s.nombre }) })
        return false
      }
      return true
    })
    setSelectS(false)
  }

  const submitAppointment = () => {
    if (!modifying) postAppointment('/schedules/createAppointment', { appointment })
    else patchData('/schedules/updateAppointment/' + modifying._id, { appointment })
  }

  useEffect(() => {
    if (dataAppointment) {
      const newPatient = { ...patientData.patient }
      newPatient.citasPrevias.push(appointment)
      updatePatient(newPatient)
      quitAddAppointment()
    }
  }, [dataAppointment])

  useEffect(() => {
    if (dataPatch) {
      const newPatient = { ...patientData.patient }
      const newAppointments = newPatient.citasPrevias.map((a) => {
        if (a._id === dataPatch.data._id) {
          a = appointment
        }
        return a
      })
      newPatient.citasPrevias = newAppointments
      updatePatient(newPatient)
      quitAddAppointment()
    }
  }, [dataPatch])

  const [patients, setPatients] = useState()
  const handleSearch = (patients) => {
    setPatients(patients)
  }
  console.log(patients)

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
                <input type="time" value={appointment.hora} name="inputCIP" onChange={({ target }) => setAppointment((prev) => { return { ...prev, hora: target.value } })} required="required"/>
              </div>
              <div>
                <label>Fecha: </label>
                <DatePicker className='DatePicker' format='dd/MM/yyyy' clearIcon={null} autoFocus={false} onChange={(target) => setAppointment((prev) => { return { ...prev, fecha: target } })} value={appointment.fecha} />
              </div>
            </div>
            <div className='addAppointment_agenda'>
              <label>{leng.seleccionarAgenda}</label>
              <div className="search">
                <div className="med">{appointment.nombreAgenda}</div>
                <button type='button' onClick={() => { setSelectS(true) }} className='search_button'><FontAwesomeIcon icon={faMagnifyingGlass}/></button>
              </div>
            </div>
            <div className='addAppointment_paciente'>
              <label>Seleccionar paciente: </label>
              <SearchForm handleSearch={handleSearch} type='appointment'/>
              <div className="addAppointment_paciente_list">
                {
                  patients
                    ? <>
                      <div className="addAppointment_paciente_list_table">
                        <table>
                          <thead>
                            <tr>
                              <th>{leng.nombreCompleto}</th>
                              <th>CIP</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              patients.map((p, index) => {
                                let select = false
                                if (appointment.paciente === p._id) select = true
                                return <tr key={index} onClick={() => handleClick(p)} className={select ? 'pair' : null}>
                                  <td>{getName(p.nombre, p.apellido1, p.apellido2)}</td>
                                  <td>{p.cip}</td>
                                </tr>
                              })
                            }
                          </tbody>
                        </table>
                      </div>
                    </>
                    : null
                }
              </div>
            </div>
            <div className='addAppointment_motivo'>
              <label>Motivo de la visita: </label>
              <textarea name="motivo" id="" rows="2" onChange={({ target }) => setAppointment((prev) => { return { ...prev, motivo: target.value } })} value={appointment.motivo}></textarea>
              <div>
                <label>Tipo Visita: </label>
              </div>
            </div>
          </div>
          <button onClick={submitAppointment} className='button_classic'>Crear cita</button>
          </>
          : null
      }
    </div>
  )
}

export default AddAppointment
