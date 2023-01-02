import { React, useEffect, useState } from 'react'
import { useGlobalContext } from '../../hooks/useGlobalContext'
import { getLenguage } from '../../utils/lenguage'
import { useNavigate, useParams } from 'react-router-dom'
import { usePatientContext } from '../../hooks/usePatientContext'
import useFetch from '../../hooks/useFetch'
import Search from './patientInfo/Search'
import DiagnosisList from './patientEntries/DiagnosisList'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCapsules, faCheck, faFileImport, faFloppyDisk, faMagnifyingGlass, faTrash } from '@fortawesome/free-solid-svg-icons'
import useDelete from '../../hooks/useDelete'
import AddPrescription from './patientInfo/AddPrescription'
import { getDate, getHour, getName } from '../../utils/utils'
import usePost from '../../hooks/usePost'
import usePatch from '../../hooks/usePatch'

const ReportContainer = () => {
  const { globalData } = useGlobalContext()
  const { patientData, updatePatient } = usePatientContext()
  const leng = getLenguage(globalData.lenguage, 'patient')
  const { worker } = globalData

  const navigate = useNavigate()
  useEffect(() => {
    if (!worker) navigate('/app/login')
  }, [])

  const { id: patientId } = useParams()
  const [search, setSearch] = useState(false)
  const [diagnosisComponent, setDiagnosisComponent] = useState()
  const [newReportData, setNewReportData] = useState({
    horaEntrada: getHour(globalData.report.fechaEntrada),
    horaAssistencia: getHour(new Date()),
    atencionMedico: true,
    atencionEnfermero: true,
    motivo: '',
    antecedentes: '',
    clinica: '',
    exploracion: '',
    pruebasComplementarias: '',
    diagnostico: null,
    estado: 'activo',
    descDiagnostico: '',
    planTerapeutico: '',
    prescripciones: []
  })
  const [status, setStatus] = useState({
    active: 'active',
    inactive: 'inactive'
  })
  const [activeDiagnosis, setActiveDiagnosis] = useState([])
  const [inactiveDiagnosis, setInactiveDiagnosis] = useState([])
  const [recs, setRecs] = useState()
  const [errormessage, setErrorMessage] = useState('')
  const [showAddPrescription, setShowAddPrescription] = useState(false)
  const [exit, setExit] = useState(false)

  const { fetchData: fetchDataPatient, data: dataPatient } = useFetch()
  const { fetchData: fetchRec, data: dataRec } = useFetch()
  const { patchData: updatePatientBD, data: dataUpdatePatient } = usePatch()

  useEffect(() => {
    fetchDataPatient('/patients/' + patientId)
  }, [])

  useEffect(() => {
    if (dataPatient) {
      const newActiveDiagnosis = []
      const newInactiveDiagnosis = []
      dataPatient.entradas.map((entry) => {
        return entry.notas.map(nota => {
          return nota.estado === 'activo' ? newActiveDiagnosis.push(nota.diagnostico) : newInactiveDiagnosis.push(nota.diagnostico)
        })
      })
      setDiagnosisComponent(() => {
        if (status.active === 'active') {
          return <DiagnosisList updateSelectedDiagnosis={''} diagnosis={newActiveDiagnosis} filterDiagnosis={handleClickDiagnosis}/>
        }
        return <DiagnosisList updateSelectedDiagnosis={''} diagnosis={newInactiveDiagnosis} filterDiagnosis={handleClickDiagnosis}/>
      })
      setActiveDiagnosis(newActiveDiagnosis)
      setInactiveDiagnosis(newInactiveDiagnosis)
      updatePatient({ patient: dataPatient })
    }
  }, [dataPatient])

  useEffect(() => {
    if (patientData.patient) {
      patientData.patient.entradas.map((entry) => {
        return entry.notas.map(nota => {
          return nota.estado === 'activo' ? setActiveDiagnosis(prev => [...prev, nota.diagnostico]) : setInactiveDiagnosis(prev => [...prev, nota.diagnostico])
        })
      })
    }
  }, [patientData])

  useEffect(() => {
    if (newReportData.clinica) fetchRec('/entries/getDiagnosisRec', { clinica: newReportData.clinica })
  }, [newReportData.clinica])

  useEffect(() => {
    if (dataRec) setRecs(dataRec)
  }, [dataRec])

  const submitDiagnosis = (diagnosis) => {
    if (diagnosis !== '') {
      setNewReportData((prev) => { return ({ ...prev, diagnostico: diagnosis }) })
      setDiagnosisComponent(() => {
        if (status.active === 'active') {
          return <DiagnosisList updateSelectedDiagnosis={diagnosis.nombre} diagnosis={activeDiagnosis} filterDiagnosis={handleClickDiagnosis}/>
        }
        return <DiagnosisList updateSelectedDiagnosis={diagnosis.nombre} diagnosis={inactiveDiagnosis} filterDiagnosis={handleClickDiagnosis}/>
      })
    }
    setSearch(false)
  }

  const handleClickDiagnosis = (diagnosis) => {
    setNewReportData((prev) => {
      if (prev.diagnostico) {
        if (prev.diagnostico.nombre === diagnosis.nombre) {
          return { ...prev, diagnostico: null }
        } else return { ...prev, diagnostico: diagnosis }
      } else return { ...prev, diagnostico: diagnosis }
    })
    setStatus((prev) => {
      if (prev.active === 'active') {
        setActiveDiagnosis(act => {
          setDiagnosisComponent(<DiagnosisList updateSelectedDiagnosis={diagnosis ? diagnosis.nombre : ''} diagnosis={act} filterDiagnosis={handleClickDiagnosis}/>)
          return act
        })
      } else {
        setInactiveDiagnosis(inac => {
          setDiagnosisComponent(<DiagnosisList updateSelectedDiagnosis={diagnosis ? diagnosis.nombre : ''} diagnosis={inac} filterDiagnosis={handleClickDiagnosis}/>)
          return inac
        })
      }
      return prev
    })
  }

  const handleActive = (e) => {
    const name = e.target.name
    setDiagnosisComponent(() => {
      if (name === 'active') {
        setStatus(() => {
          return { active: 'active', inactive: 'inactive' }
        })
        return <DiagnosisList updateSelectedDiagnosis={newReportData.diagnostico ? newReportData.diagnostico.nombre : ''} diagnosis={activeDiagnosis} filterDiagnosis={handleClickDiagnosis}/>
      }
      setStatus(() => {
        return { active: 'inactive', inactive: 'active' }
      })
      return <DiagnosisList updateSelectedDiagnosis={newReportData.diagnostico ? newReportData.diagnostico.nombre : ''} diagnosis={inactiveDiagnosis} filterDiagnosis={handleClickDiagnosis}/>
    })
  }

  const { deleteData: delPres } = useDelete()
  const { deleteData: delAppointment } = useDelete()

  const deletePrescription = (index) => {
    setNewReportData((prev) => {
      delPres('/prescriptions/deletePrescription/' + prev.prescripciones[index]._id, { worker: globalData.worker._id, centre: globalData.center, removedPrincipioActivo: prev.prescripciones[index].principioActivo, patient: prev.prescripciones[index].paciente })
      const arr = [...prev.prescripciones]
      arr.splice(index, 1)
      return { ...prev, prescripciones: arr }
    })
  }

  const { postData } = usePost()

  const addReport = async () => {
    if (newReportData.diagnostico === null) {
      setErrorMessage('Por favor, seleccione un diagnostico.')
    } else if (!newReportData.atencionMedico && !newReportData.atencionEnfermero) {
      setErrorMessage('Por favor, indique el sanitario que ha atendido al paciente.')
    } else {
      setErrorMessage(null)
      // eslint-disable-next-line new-cap
      const data = {
        center: globalData.center,
        tradName: leng.nombre,
        name: dataPatient.nombre + ' ' + dataPatient.apellido1 + ' ' + dataPatient.apellido2,
        cip: dataPatient.cip,
        tradNacimiento: leng.nacimiento,
        nacimiento: getDate(dataPatient.fechaNacimiento),
        tradSexo: leng.sexo,
        sexo: dataPatient.sexo,
        tradTitle: leng.informe,
        paciente: dataPatient._id
      }
      postData('/patients/report/upload', { report: data })
      delAppointment('/schedules/deleteUrgAppointment/' + globalData.report._id, { agenda: globalData.report.agenda })
      navigate('/app/home')
    }
  }

  const addPrescription = (prescription) => {
    setNewReportData((prev) => {
      const arr = [...prev.prescripciones]
      arr.push(prescription)
      return { ...prev, prescripciones: arr }
    })
    setShowAddPrescription(false)
  }

  const quitAddPrescription = () => {
    setShowAddPrescription(false)
  }

  const handleClickMed = () => {
    setNewReportData((prev) => { return { ...prev, atencionMedico: !prev.atencionMedico } })
  }

  const handleClickEnf = () => {
    setNewReportData((prev) => { return { ...prev, atencionEnfermero: !prev.atencionEnfermero } })
  }

  useEffect(() => {
    if (dataUpdatePatient) {
      const newPatient = { ...patientData.patient }
      newPatient.antecedentes = newReportData.antecedentes
      updatePatient({ patient: newPatient })
      setExit(true)
      setTimeout(function () {
        setExit(false)
      }, 5000)
    }
  }, [dataUpdatePatient])

  const saveAntecedentes = () => {
    updatePatientBD('/patients/' + patientData.patient._id + '/updatePatient', { antecedentes: newReportData.antecedentes })
  }

  const importAntecedentes = () => {
    setNewReportData((prev) => { return { ...prev, antecedentes: patientData.patient.antecedentes } })
  }

  return (
    <>
      <div className='report'>
          {dataPatient
            ? <>
              {
                !showAddPrescription
                  ? <>
                    <div className="patient_report_container_infoReport">
                      <div className="patient_report_container_datosPaciente">
                        <div className="float_title">{leng.datosPaciente}</div>
                        <label>CIP: </label>
                        <p>{dataPatient.cip}</p>
                        <label>{leng.nombre}:</label>
                        <p>{getName(dataPatient.nombre, dataPatient.apellido1, dataPatient.apellido2)}</p>
                        <label>{leng.nacimiento}</label>
                        <p>{getDate(dataPatient.fechaNacimiento)}</p>
                        <label>{leng.sexo}:</label>
                        <p>{dataPatient.sexo}</p>
                        <a href={'/app/patients/' + dataPatient._id}><button type='button' className='button_classic'>{leng.cursoClinico}</button></a>
                      </div>
                      <div className="reportForm_datosInforme">
                        <div className="float_title">{leng.datosInforme}</div>
                        <div className="horas">
                          <label>{leng.horaEntrada}:</label>
                          <div className='box'>{newReportData.horaEntrada}</div>
                          <label>{leng.horaAsistencia}:</label>
                          <div className='box'>{newReportData.horaAssistencia}</div>
                        </div>
                        <div className="visita">
                          <label>{leng.visitadoPor}:</label>
                          <input type="radio" checked={newReportData.atencionMedico === true} name="inputMed" onClick={handleClickMed} required="required"/>
                          <p>{leng.medico}</p>
                          <input type="radio" checked={newReportData.atencionEnfermero === true} name="inputEnf" onClick={handleClickEnf} required="required"/>
                          <p>{leng.enfermero}</p>
                        </div>
                      </div>
                    </div>
                    <div className="patient_report_container_addReport">
                      {search ? <Search type='diagnosis' submit={submitDiagnosis}/> : null}
                      <form className='reportForm crossbar' action="">
                        <div className="reportForm_anamsesio">
                          <div className="float_title">{leng.amnanesi}</div>
                          <label>{leng.motivo}</label>
                          <textarea name="motivo" id="" rows="2" onChange={({ target }) => setNewReportData((prev) => { return { ...prev, motivo: target.value } })} value={newReportData.motivo}></textarea>
                          <label>{leng.antecedentes}</label>
                          <div className="antecedentes">
                            <textarea name="antecedentes" id="" rows="4" onChange={({ target }) => setNewReportData((prev) => { return { ...prev, antecedentes: target.value } })} value={newReportData.antecedentes}></textarea>
                            <div className="antecedentes_buttons">
                              <button className='button_classic' type='button' onClick={importAntecedentes}><FontAwesomeIcon className='icon' icon={faFileImport}/></button>
                              <button className='button_classic'type='button' onClick={saveAntecedentes}><FontAwesomeIcon className={exit ? 'icon exit' : 'icon noexit'} icon={exit ? faCheck : faFloppyDisk}/></button>
                            </div>
                          </div>
                          <label>{leng.clinica}</label>
                          <textarea name="clinica" id="" rows="4" onChange={({ target }) => setNewReportData((prev) => { return { ...prev, clinica: target.value } })} value={newReportData.clinica}></textarea>
                        </div>
                        <div className="reportForm_exploracion">
                          <div className="float_title">{leng.exploracion}</div>
                          <label>{leng.descripcion}</label>
                          <textarea name="exploracion" id="" rows="4" onChange={({ target }) => setNewReportData((prev) => { return { ...prev, exploracion: target.value } })} value={newReportData.exploracion}></textarea>
                          <label>{leng.pruebas}</label>
                          <textarea name="exploracion" id="" rows="4" onChange={({ target }) => setNewReportData((prev) => { return { ...prev, pruebasComplementarias: target.value } })} value={newReportData.pruebasComplementarias}></textarea>
                        </div>
                        <div className="reportForm_diagnostico">
                          <div className="float_title">{leng.orientacion}</div>
                          <label>{leng.diagnostico}</label>
                          <div className="search">
                            <div className="diagnosis">{newReportData.diagnostico ? newReportData.diagnostico.nombre : '' }</div>
                            <button type='button' onClick={() => { setSearch(true) }} className='search_button'><FontAwesomeIcon icon={faMagnifyingGlass}/></button>
                          </div>
                          {
                            recs && recs.length > 0
                              ? <>
                                <label>{leng.rec}</label>
                                <div className="recs">
                                  {
                                    recs.map((rec, index) => {
                                      return <div onClick={() => { submitDiagnosis(rec) }} key={index} className="rec">{rec.nombre}</div>
                                    })
                                  }
                                </div>
                              </>
                              : null
                          }
                          <label>{leng.descripcion}</label>
                          <textarea name="desc_diagnostico" id="" rows="4" onChange={({ target }) => setNewReportData((prev) => { return { ...prev, descDiagnostico: target.value } })} value={newReportData.descDiagnostico}></textarea>
                        </div>
                        <div className="reportForm_plan_terapeutico">
                          <div className="float_title">{leng.plan}</div>
                          <label>{leng.descripcion}</label>
                          <textarea name="desc_diagnostico" id="" rows="4" onChange={({ target }) => setNewReportData((prev) => { return { ...prev, planTerapeutico: target.value } })} value={newReportData.planTerapeutico}></textarea>
                          <label>{leng.prescripciones}</label>
                          {
                            newReportData.prescripciones.length > 0
                              ? <>
                              {
                                newReportData.prescripciones.map((prescription, index) => {
                                  return (
                                    <div key={index} className="prescription">
                                      <div className="prescription_name">{prescription.nombreMedicamento}</div>
                                      <button type='button' onClick={() => { deletePrescription(index) }} className='delete_prescription_button'><FontAwesomeIcon icon={faTrash}/></button>
                                    </div>
                                  )
                                })
                              }
                              </>
                              : <>
                                <div className='no_prescriptions'>{leng.noPres}</div>
                            </>
                          }
                          <div className="plan_options">
                            <button type='button' className='capsules_button' onClick={() => { setShowAddPrescription(true) }}><FontAwesomeIcon className='icon' icon={faCapsules}/></button>
                          </div>
                        </div>
                        <div className="reportForm_save">
                          {
                            errormessage
                              ? <div className="error"><p className="error_message">{errormessage}</p></div>
                              : null
                          }
                          <button type='button' className='button_classic addNote' onClick={addReport}>{leng.guardar}</button>
                        </div>
                      </form>
                      <div className="patient_report_container_diagnosis">
                          <div className="patient_report_container_diagnosis_options">
                            <button id='active_section' name="active" onClick={handleActive} className={'button_tag ' + status.active}>{leng.activo}</button>
                            <button id='inactive_section' name="inactive" onClick={handleActive} className={'button_tag ' + status.inactive}>{leng.inactivo}</button>
                          </div>
                          <div className="patient_report_container_diagnosis_list">
                            {diagnosisComponent}
                          </div>
                        </div>
                    </div>
                  </>
                  : <AddPrescription diagnosis={newReportData.diagnostico} addPrescription={addPrescription} quitAddPrescription={quitAddPrescription}/>
              }
            </>
            : null
          }
      </div>
    </>
  )
}

export default ReportContainer
