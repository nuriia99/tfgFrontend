import { React, useState, useEffect } from 'react'
import { useGlobalContext } from '../../../hooks/useGlobalContext'
import { usePatientContext } from '../../../hooks/usePatientContext'
// import { getLenguage } from '../../../utils/lenguage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket, faFileImport, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import Search from './Search'
import usePost from '../../../hooks/usePost'
import useFetch from '../../../hooks/useFetch'

const AddPrescription = ({ diagnosis, quitAddPrescription, addPrescription }) => {
  const { globalData } = useGlobalContext()
  const { patientData, updatePatient } = usePatientContext()
  const [search, setSearch] = useState(false)
  const [error, setError] = useState(null)
  const [prescription, setPrescription] = useState({
    diagnostico: diagnosis,
    patient: patientData.patient._id,
    fechaInicio: new Date(),
    fechaFinal: '',
    trabajador: globalData.worker._id,
    instruccionesPaciente: '',
    instruccionesFarmacia: '',
    nombreMedicamento: '',
    principioActivo: '',
    unidad: '1',
    frecuencia: '12',
    frecuenciaRadio: 'hours',
    duracion: '7',
    duracionRadio: 'days'
  })
  const [insPac, setInsPac] = useState('')
  const [insFar, setInsFar] = useState('')
  // const [rec, setRecs] = useState()

  const { fetchData: getRecs, data: dataRecs } = useFetch()

  useEffect(() => {
    if (diagnosis) getRecs('/trabajadores/' + globalData.worker._id + '/getRecs/' + diagnosis._id)
  }, [])

  useEffect(() => {
    if (dataRecs) console.log(dataRecs)
  }, [dataRecs])

  useEffect(() => {
    setInsFar('')
    setInsPac('')
  }, [prescription.nombreMedicamento])

  const submitMed = (med) => {
    setSearch(false)

    setPrescription((prev) => {
      return {
        ...prev,
        instruccionesPaciente: med.insPaciente,
        instruccionesFarmacia: med.insFarmacia,
        nombreMedicamento: med.nombre,
        principioActivo: med.principioActivo,
        idMed: med._id,
        unidad: med.unidad,
        frecuencia: med.frecuencia,
        duracion: med.duracion
      }
    })
  }

  const importInsPac = () => {
    setInsPac(prescription.instruccionesPaciente)
  }

  const importInsFar = () => {
    setInsFar(prescription.instruccionesFarmacia)
  }

  const { postData: postPres, data: dataPres } = usePost()

  const abr = {
    hours: 'h.',
    days: 'd.',
    weeks: 'w.',
    months: 'm.'
  }

  const [newPres, setNewPres] = useState()

  const submitPres = () => {
    if (prescription.nombreMedicamento === '') setError('Por favor, seleccione un medicamento.')
    else {
      setError(null)
      const d = new Date()
      d.setDate(d.getDate() + parseInt(prescription.duracion))
      let duration = prescription.duracion + abr[prescription.duracionRadio]
      if (prescription.duracionRadio === 'ind') duration = 'Ind.'
      console.log(prescription)
      const newPrescription = {
        duracion: duration,
        fechaFinal: d,
        fechaInicio: prescription.fechaInicio,
        frecuencia: prescription.unidad + ' x ' + prescription.frecuencia + abr[prescription.frecuenciaRadio],
        instruccionesPaciente: prescription.instruccionesPaciente,
        instruccionesFarmacia: prescription.instruccionesFarmacia,
        nombreMedicamento: prescription.nombreMedicamento,
        patient: prescription.patient,
        principioActivo: prescription.principioActivo,
        trabajador: prescription.trabajador,
        idMed: prescription.idMed
      }
      setNewPres(newPrescription)
      console.log(newPres)
      postPres('/prescriptions/createPrescription', { newPrescription, diagnostico: prescription.diagnostico })
    }
  }

  useEffect(() => {
    if (dataPres) {
      const newPrescription = { ...newPres, _id: dataPres.data._id }
      const newPatient = { ...patientData.patient }
      newPatient.prescripciones.push(newPres)
      updatePatient(newPatient)
      addPrescription(newPrescription)
    }
  }, [dataPres])

  const handleClickRec = (med) => {
    setPrescription((prev) => {
      return {
        ...prev,
        instruccionesPaciente: med.insPaciente,
        instruccionesFarmacia: med.insFarmacia,
        nombreMedicamento: med.nombre,
        principioActivo: med.principioActivo,
        idMed: med._id,
        unidad: med.unidad,
        frecuencia: med.frecuencia,
        duracion: med.duracion
      }
    })
  }

  return (
    <>
      <div className="addPrescription">
        <div className="addPrescription_container">
          {search ? <Search type='med' submit={submitMed}/> : null}
          <div className="addPrescription_container_left">
            <div className="seccion">
              <div className="float_title">Búsqueda del medicamento</div>
              <label>Elección del medicamento</label>
              <div className="search">
                <div className="med">{prescription.nombreMedicamento}</div>
                <button type='button' onClick={() => { setSearch(true) }} className='search_button'><FontAwesomeIcon icon={faMagnifyingGlass}/></button>
              </div>
              <label>Recomendaciones: </label>
              {
                dataRecs
                  ? <div className="recs">
                    {
                      dataRecs.map((rec, index) => {
                        return <div onClick={() => handleClickRec(rec.medicamento)} key={index} className="rec">{rec.medicamento.nombre}</div>
                      })
                    }
                  </div>
                  : null
              }
              <label>Instrucciones para el paciente</label>
              <div className="instruccions">
                <textarea name="desc_diagnostico" id="" rows="2" onChange={({ target }) => setInsPac(target.value)} value={insPac}></textarea>
                <button type='button' onClick={importInsPac}><FontAwesomeIcon className='icon' icon={faFileImport}/></button>
              </div>
              <label>Instrucciones para la farmacia</label>
              <div className="instruccions">
                <textarea name="desc_diagnostico" id="" rows="2" onChange={({ target }) => setInsFar(target.value)} value={insFar}></textarea>
                <button type='button' onClick={importInsFar}><FontAwesomeIcon className='icon' icon={faFileImport}/></button>
              </div>
            </div>
            {
              error
                ? <div className="error"><p className="error_message">{error}</p></div>
                : null
            }
            <button onClick={submitPres} className='button_classic'>Añadir prescripción</button>
          </div>
          <div className="addPrescription_container_right">
            <div className="seccions">
              <div className="seccion">
                <div className="float_title">Posología</div>
                <div className="seccion_info">
                  <input min={0} type="number" value={prescription.unidad} name="inputName" onChange={({ target }) => setPrescription((prev) => { return { ...prev, unidad: target.value } })} required="required"/>
                  <p>unidades/toma</p>
                </div>
                <p>Cada:</p>
                <div className="seccion_info">
                  <input min={0} type="number" value={prescription.frecuencia} name="inputName" onChange={({ target }) => setPrescription((prev) => { return { ...prev, frecuencia: target.value } })} required="required"/>
                  <div className="seccion_info_radio">
                    <div className="seccion_info_radio_hours">
                      <input type="radio" checked={prescription.frecuenciaRadio === 'hours' ? 1 : 0} onChange={() => setPrescription((prev) => { return { ...prev, frecuenciaRadio: 'hours' } })} required="required"/>
                      <p>horas</p>
                    </div>
                    <div className="seccion_info_radio_weeks">
                      <input type="radio" checked={prescription.frecuenciaRadio === 'weeks' ? 1 : 0} onChange={() => setPrescription((prev) => { return { ...prev, frecuenciaRadio: 'weeks' } })} required="required"/>
                      <p>semanas</p>
                    </div>
                    <div className="seccion_info_radio_days">
                      <input type="radio" checked={prescription.frecuenciaRadio === 'days' ? 1 : 0} onChange={() => setPrescription((prev) => { return { ...prev, frecuenciaRadio: 'days' } })} required="required"/>
                      <p>dias</p>
                    </div>
                    <div className="seccion_info_radio_months">
                      <input type="radio" checked={prescription.frecuenciaRadio === 'months' ? 1 : 0} onChange={() => setPrescription((prev) => { return { ...prev, frecuenciaRadio: 'months' } })} required="required"/>
                      <p>mesos</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="seccion">
                <div className="float_title">Duración del tratamiento</div>
                <p>Durante:</p>
                <div className="seccion_info">
                  <input min={0} type="number" value={prescription.duracion} name="inputName" onChange={({ target }) => setPrescription((prev) => { return { ...prev, duracion: target.value } })} required="required"/>
                  <div className="seccion_info_radio">
                    <div className="seccion_info_radio_hours">
                      <input type="radio" checked={prescription.duracionRadio === 'days' ? 1 : 0} onChange={() => setPrescription((prev) => { return { ...prev, duracionRadio: 'days' } })} required="required"/>
                      <p>dias</p>
                    </div>
                    <div className="seccion_info_radio_weeks">
                      <input type="radio" checked={prescription.duracionRadio === 'months' ? 1 : 0} onChange={() => setPrescription((prev) => { return { ...prev, duracionRadio: 'months' } })} required="required"/>
                      <p>meses</p>
                    </div>
                    <div className="seccion_info_radio_days">
                      <input type="radio" checked={prescription.duracionRadio === 'weeks' ? 1 : 0} onChange={() => setPrescription((prev) => { return { ...prev, duracionRadio: 'weeks' } })} required="required"/>
                      <p>semanas</p>
                    </div>
                    <div className="seccion_info_radio_months">
                      <input type="radio" checked={prescription.duracionRadio === 'ind' ? 1 : 0} onChange={() => setPrescription((prev) => { return { ...prev, duracionRadio: 'ind' } })} required="required"/>
                      <p>indefinido</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="exit">
              <button onClick={quitAddPrescription} className='button_classic'><FontAwesomeIcon className='icon' icon={faArrowRightFromBracket}/></button>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AddPrescription