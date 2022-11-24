import { React, useEffect, useState } from 'react'
import PatientEntry from './PatientEntry'
import { useGlobalContext } from '../../../hooks/useGlobalContext'
import { getLenguage } from '../../../utils/lenguage'
import DiagnosisList from './DiagnosisList'
import { usePatientContext } from '../../../hooks/usePatientContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCapsules, faMagnifyingGlass, faTrash } from '@fortawesome/free-solid-svg-icons'
import AddPrescription from '../patientInfo/AddPrescription'
import Search from '../patientInfo/Search'
import usePost from '../../../hooks/usePost'
import { getCurrentDate, getDate } from '../../../utils/utils'

const PatientEntries = () => {
  const { globalData } = useGlobalContext()
  const { patientData, updatePatient } = usePatientContext()
  const leng = getLenguage(globalData.lenguage, 'patient')
  const [allEntries, setAllEntries] = useState([])
  const [entries, setEntries] = useState([])
  const [diagnosisComponent, setDiagnosisComponent] = useState()
  const [principalComponent, setPrincipalComponent] = useState('entries')
  const [status, setStatus] = useState({
    active: 'active',
    inactive: 'inactive'
  })
  const [activeDiagnosis, setActiveDiagnosis] = useState([])
  const [inactiveDiagnosis, setInactiveDiagnosis] = useState([])
  let lastDiagnosis = ''
  const [search, setSearch] = useState(false)
  const [newEntryData, setNewEntryData] = useState({
    motivo: '',
    antecedentes: '',
    clinica: '',
    exploracion: '',
    pruebasComplementarias: '',
    diagnostico: null,
    estado: true,
    descDiagnostico: '',
    planTerapeutico: '',
    prescripciones: []
  })
  const [showAddPrescription, setShowAddPrescription] = useState(false)
  let modifyingNote = {
    entry: '',
    note: ''
  }

  const handleClickDiagnosis = (diagnosis) => {
    setPrincipalComponent((prev) => {
      if (prev === 'entries') {
        if (diagnosis.nombre === lastDiagnosis) {
          setEntries(allEntries)
          lastDiagnosis = ''
        } else {
          const newEntries = []
          allEntries.forEach((entry) => {
            entry.notas.forEach(nota => {
              if (nota.diagnostico.nombre === diagnosis.nombre) newEntries.push(entry)
            })
          })
          setEntries(newEntries)
          lastDiagnosis = diagnosis.nombre
        }
      } else {
        setNewEntryData((prev) => {
          console.log(prev.diagnostico)
          console.log(diagnosis.nombre)
          if (prev.diagnostico) {
            if (prev.diagnostico.nombre === diagnosis.nombre) {
              return { ...prev, diagnostico: null }
            } else return { ...prev, diagnostico: diagnosis }
          } else return { ...prev, diagnostico: diagnosis }
        })
      }
      return prev
    })
  }

  const deletePrescription = (index) => {
    setNewEntryData((prev) => {
      console.log(prev.prescripciones)
      const arr = [...prev.prescripciones]
      arr.splice(index, 1)
      return { ...prev, prescripciones: arr }
    })
  }

  const submitDiagnosis = (diagnosis) => {
    setSearch(false)
    setNewEntryData((prev) => { return ({ ...prev, diagnostico: diagnosis.nombre }) })
    setDiagnosisComponent(() => {
      if (status.active === 'active') {
        return <DiagnosisList updateSelectedDiagnosis={diagnosis.nombre} diagnosis={activeDiagnosis} filterDiagnosis={handleClickDiagnosis}/>
      }
      return <DiagnosisList updateSelectedDiagnosis={diagnosis.nombre} diagnosis={inactiveDiagnosis} filterDiagnosis={handleClickDiagnosis}/>
    })
  }

  const handleActive = (e) => {
    const name = e.target.name
    setDiagnosisComponent(() => {
      if (name === 'active') {
        setStatus(() => {
          return { active: 'active', inactive: 'inactive' }
        })
        return <DiagnosisList updateSelectedDiagnosis='' diagnosis={activeDiagnosis} filterDiagnosis={handleClickDiagnosis}/>
      }
      setStatus(() => {
        return { active: 'inactive', inactive: 'active' }
      })
      return <DiagnosisList updateSelectedDiagnosis='' diagnosis={inactiveDiagnosis} filterDiagnosis={handleClickDiagnosis}/>
    })
  }
  useEffect(() => {
    if (patientData.patient) {
      setAllEntries(patientData.patient.entradas)
      setEntries(patientData.patient.entradas)
      patientData.patient.entradas.map((entry) => {
        return entry.notas.map(nota => {
          return nota.estado === 'activo' ? setActiveDiagnosis(prev => [...prev, nota.diagnostico]) : setInactiveDiagnosis(prev => [...prev, nota.diagnostico])
        })
      })
    }
  }, [patientData])
  useEffect(() => {
    setDiagnosisComponent(<DiagnosisList updateSelectedDiagnosis='' diagnosis={activeDiagnosis} filterDiagnosis={handleClickDiagnosis}/>)
  }, [activeDiagnosis])

  const quitAddPrescription = () => {
    setShowAddPrescription(false)
  }

  const addPrescription = (prescription) => {
    setNewEntryData((prev) => {
      const arr = [...prev.prescripciones]
      arr.push(prescription)
      return { ...prev, prescripciones: arr }
    })
    setShowAddPrescription(false)
  }

  const { postData, error, data } = usePost()
  const newPatient = { ...patientData.patient }
  const addNote = async () => {
    if (modifyingNote.entry === '') {
      let newNote = { ...newEntryData, diagnostico: newEntryData.diagnostico }
      const lastEntryDate = getDate(patientData.patient.entradas[0].fecha)
      if (getCurrentDate() === lastEntryDate) {
        newNote = { ...newNote, entryId: patientData.patient.entradas[0]._id }
        newPatient.entradas[0].notas.push(newNote)
        await postData('/entries/createNote', newNote)
      } else {
        const newEntry = {
          paciente: patientData.patient._id,
          fecha: new Date(),
          lenguaje: globalData.lenguage,
          trabajador: { id: globalData.worker._id, role: globalData.role },
          notas: [newNote]
        }
        newPatient.entradas.unshift(newEntry)
        await postData('/entries/createEntry', newEntry)
      }
    } else {
      console.log('a')
    }
  }

  useEffect(() => {
    if (error) console.log(error.response.data)
    if (data) {
      updatePatient(newPatient)
      setNewEntryData(() => {
        return {
          motivo: '',
          antecedentes: '',
          clinica: '',
          exploracion: '',
          pruebasComplementarias: '',
          diagnostico: null,
          estado: true,
          descDiagnostico: '',
          planTerapeutico: '',
          prescripciones: []
        }
      })
      setPrincipalComponent('entries')
    }
  }, [error, data])

  const clickNote = (entry, note) => {
    modifyingNote = { entry, note }
    const modNote = patientData.patient.entradas[entry].notas[note]
    setNewEntryData(() => {
      return {
        motivo: modNote.motivo,
        antecedentes: modNote.antecedentes,
        clinica: modNote.clinica,
        exploracion: modNote.exploracion,
        pruebasComplementarias: modNote.pruebasComplementarias,
        diagnostico: modNote.diagnostico,
        estado: modNote.estado,
        descDiagnostico: modNote.descDiagnostico,
        planTerapeutico: modNote.planTerapeutico,
        prescripciones: modNote.prescripciones
      }
    })
    setDiagnosisComponent(() => {
      if (status.active === 'active') {
        return <DiagnosisList updateSelectedDiagnosis={modNote.diagnostico.nombre} diagnosis={activeDiagnosis} filterDiagnosis={handleClickDiagnosis}/>
      }
      return <DiagnosisList updateSelectedDiagnosis={modNote.diagnostico.nombre} diagnosis={inactiveDiagnosis} filterDiagnosis={handleClickDiagnosis}/>
    })
    setPrincipalComponent('newEntry')
  }

  const changePrincipalComponent = (component) => {
    setDiagnosisComponent(() => {
      if (status.active === 'active') {
        return <DiagnosisList updateSelectedDiagnosis='' diagnosis={activeDiagnosis} filterDiagnosis={handleClickDiagnosis}/>
      }
      return <DiagnosisList updateSelectedDiagnosis='' diagnosis={inactiveDiagnosis} filterDiagnosis={handleClickDiagnosis}/>
    })
    setPrincipalComponent(component)
  }

  return (
    entries
      ? <div className="patient_entries">
        {
          !showAddPrescription
            ? <>
              <div className="patient_entries_container">
                <div className="navbar_entries">
                  <button onClick={() => changePrincipalComponent('entries')} className={principalComponent === 'entries' ? 'button_tag active' : 'button_tag inactive'}>Notas previas</button>
                  <button onClick={() => changePrincipalComponent('newEntry')} className={principalComponent === 'newEntry' ? 'button_tag active' : 'button_tag inactive'}>Añadir nota</button>
                </div>
                {
                  principalComponent === 'entries'
                    ? <>
                    <div className="patient_entries_container_list">
                    {
                      entries.map((entry, index) => {
                        return (
                          <PatientEntry clickNote={(note) => { clickNote(index, note) }} key={entry._id} entry={entry}></PatientEntry>
                        )
                      })
                    }
                    </div>
                    <div className="patient_entries_container_diagnosis">
                      <div className="patient_entries_container_diagnosis_options">
                        <button id='active_section' name="active" onClick={handleActive} className={'button_tag ' + status.active}>{leng.activo}</button>
                        <button id='inactive_section' name="inactive" onClick={handleActive} className={'button_tag ' + status.inactive}>{leng.inactivo}</button>
                      </div>
                      <div className="patient_entries_container_diagnosis_list">
                        {diagnosisComponent}
                      </div>
                    </div>
                  </>
                    : <>
                    <div className="patient_entries_container_addEntry">
                      {search ? <Search type='diagnosis' submit={submitDiagnosis}/> : null}
                      <form className='entryForm crossbar' action="">
                        <div className="entryForm_anamsesio">
                          <div className="float_title">Amnanesi</div>
                          <label>Motivo de la visita</label>
                          <textarea name="motivo" id="" rows="2" onChange={({ target }) => setNewEntryData((prev) => { return { ...prev, motivo: target.value } })} value={newEntryData.motivo}></textarea>
                          <label>Antecedentes</label>
                          <textarea name="antecedentes" id="" rows="4" onChange={({ target }) => setNewEntryData((prev) => { return { ...prev, antecedentes: target.value } })} value={newEntryData.antecedentes}></textarea>
                          <label>Clínica</label>
                          <textarea name="clinica" id="" rows="4" onChange={({ target }) => setNewEntryData((prev) => { return { ...prev, clinica: target.value } })} value={newEntryData.clinica}></textarea>
                        </div>
                        <div className="entryForm_exploracion">
                          <div className="float_title">Exploración</div>
                          <label>Descripción</label>
                          <textarea name="exploracion" id="" rows="4" onChange={({ target }) => setNewEntryData((prev) => { return { ...prev, exploracion: target.value } })} value={newEntryData.exploracion}></textarea>
                          <label>Pruebas Complementarias</label>
                          <textarea name="exploracion" id="" rows="4" onChange={({ target }) => setNewEntryData((prev) => { return { ...prev, pruebasComplementarias: target.value } })} value={newEntryData.pruebasComplementarias}></textarea>
                        </div>
                        <div className="entryForm_diagnostico">
                          <div className="float_title">Orientación diagnostica</div>
                          <label>Diagnostico Principal</label>
                          <div className="search">
                            <div className="diagnosis">{newEntryData.diagnostico ? newEntryData.diagnostico.nombre : '' }</div>
                            <button type='button' onClick={() => { setSearch(true) }} className='search_button'><FontAwesomeIcon icon={faMagnifyingGlass}/></button>
                          </div>
                          <label>Descripción</label>
                          <textarea name="desc_diagnostico" id="" rows="4" onChange={({ target }) => setNewEntryData((prev) => { return { ...prev, descDiagnostico: target.value } })} value={newEntryData.descDiagnostico}></textarea>
                        </div>
                        <div className="entryForm_plan_terapeutico">
                          <div className="float_title">Plan terapeutico</div>
                          <label>Descripción</label>
                          <textarea name="desc_diagnostico" id="" rows="4" onChange={({ target }) => setNewEntryData((prev) => { return { ...prev, planTerapeutico: target.value } })} value={newEntryData.planTerapeutico}></textarea>
                          <label>Prescripciones:</label>
                          {
                            newEntryData.prescripciones.length > 0
                              ? <>
                              {
                                newEntryData.prescripciones.map((prescription, index) => {
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
                                <div className='no_prescriptions'>No hay ninguna prescripción hecha.</div>
                              </>
                          }
                          <div className="plan_options">
                            <button className='button_classic' onClick={() => {}}>Derivar</button>
                            <button className='capsules_button' onClick={() => { setShowAddPrescription(true) }}><FontAwesomeIcon className='icon' icon={faCapsules}/></button>
                          </div>
                        </div>
                        <div className="entryForm_save">
                          <button type='button' className='button_classic' onClick={addNote}>Guardar nota</button>
                        </div>
                      </form>
                      <div className="patient_entries_container_diagnosis">
                          <div className="patient_entries_container_diagnosis_options">
                            <button id='active_section' name="active" onClick={handleActive} className={'button_tag ' + status.active}>{leng.activo}</button>
                            <button id='inactive_section' name="inactive" onClick={handleActive} className={'button_tag ' + status.inactive}>{leng.inactivo}</button>
                          </div>
                          <div className="patient_entries_container_diagnosis_list">
                            {diagnosisComponent}
                          </div>
                        </div>
                    </div>
                    </>
                }
              </div>
            </>
            : <AddPrescription addPrescription={addPrescription} quitAddPrescription={quitAddPrescription}/>
        }
      </div>
      : null
  )
}

export default PatientEntries
