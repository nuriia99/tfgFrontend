import { React, useEffect, useState } from 'react'
import PatientEntry from './PatientEntry'
import { useGlobalContext } from '../../../hooks/useGlobalContext'
import { getLenguage } from '../../../utils/lenguage'
import DiagnosisList from './DiagnosisList'
import { usePatientContext } from '../../../hooks/usePatientContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCapsules, faEraser, faMagnifyingGlass, faTrash } from '@fortawesome/free-solid-svg-icons'
import AddPrescription from '../patientInfo/AddPrescription'
import Search from '../patientInfo/Search'
import usePost from '../../../hooks/usePost'
import usePatch from '../../../hooks/usePatch'
import useDelete from '../../../hooks/useDelete'
import { getCurrentDate, getDate } from '../../../utils/utils'
import useFetch from '../../../hooks/useFetch'

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
  const [lastDiagnosis, setLastDiagnosis] = useState('')
  const [search, setSearch] = useState(false)
  const [newEntryData, setNewEntryData] = useState({
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
  const [showAddPrescription, setShowAddPrescription] = useState(false)
  const [modifyingNote, setModifyingNote] = useState({
    entry: '',
    note: ''
  })
  const [removedDiagnosis, setRemovedDiagnosis] = useState('')
  const handleClickDiagnosis = (diagnosis) => {
    setPrincipalComponent((prev) => {
      if (prev === 'entries') {
        setLastDiagnosis(prev => {
          if (diagnosis.nombre === prev) {
            setEntries(allEntries)
            setLastDiagnosis('')
          } else {
            const newEntries = []
            allEntries.forEach((entry) => {
              entry.notas.forEach(nota => {
                if (nota.diagnostico.nombre === diagnosis.nombre) newEntries.push(entry)
              })
            })
            setEntries(newEntries)
            setLastDiagnosis(diagnosis.nombre)
          }
        })
      } else {
        setNewEntryData((prev) => {
          if (prev.diagnostico) {
            if (prev.diagnostico.nombre === diagnosis.nombre) {
              return { ...prev, diagnostico: null }
            } else return { ...prev, diagnostico: diagnosis }
          } else return { ...prev, diagnostico: diagnosis }
        })
        setStatus((prev) => {
          setDiagnosisComponent(() => {
            if (prev.active === 'active') {
              return <DiagnosisList updateSelectedDiagnosis={diagnosis ? diagnosis.nombre : ''} diagnosis={activeDiagnosis} filterDiagnosis={handleClickDiagnosis}/>
            }
            return <DiagnosisList updateSelectedDiagnosis={diagnosis ? diagnosis.nombre : ''} diagnosis={inactiveDiagnosis} filterDiagnosis={handleClickDiagnosis}/>
          })
          return prev
        })
      }
      return prev
    })
  }

  const { deleteData: delPres, data: dataDeletePres } = useDelete()

  const deletePrescription = (index) => {
    setNewEntryData((prev) => {
      delPres('/prescriptions/deletePrescription/' + prev.prescripciones[index]._id, { worker: globalData.worker._id, centre: globalData.center, removedPrincipioActivo: prev.prescripciones[index].principioActivo, patient: prev.prescripciones[index].paciente })
      const arr = [...prev.prescripciones]
      arr.splice(index, 1)
      return { ...prev, prescripciones: arr }
    })
  }
  useEffect(() => {
    if (dataDeletePres) console.log(dataDeletePres)
  }, [dataDeletePres])

  const submitDiagnosis = (diagnosis) => {
    setSearch(false)
    setNewEntryData((prev) => { return ({ ...prev, diagnostico: diagnosis }) })
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
        return <DiagnosisList updateSelectedDiagnosis={newEntryData.diagnostico ? newEntryData.diagnostico.nombre : ''} diagnosis={activeDiagnosis} filterDiagnosis={handleClickDiagnosis}/>
      }
      setStatus(() => {
        return { active: 'inactive', inactive: 'active' }
      })
      return <DiagnosisList updateSelectedDiagnosis={newEntryData.diagnostico ? newEntryData.diagnostico.nombre : ''} diagnosis={inactiveDiagnosis} filterDiagnosis={handleClickDiagnosis}/>
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
    setDiagnosisComponent(<DiagnosisList updateSelectedDiagnosis={newEntryData.diagnostico ? newEntryData.diagnostico.nombre : ''} diagnosis={activeDiagnosis} filterDiagnosis={handleClickDiagnosis}/>)
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
  const { patchData: updateNote, error: errorUpdate, data: dataUpdate } = usePatch()
  const { deleteData: deleteNote, error: errorDelete, data: dataDelete } = useDelete()
  const { fetchData: fetchRec, data: dataRec } = useFetch()
  const [recs, setRecs] = useState()
  const newPatient = { ...patientData.patient }
  const [errormessage, setErrorMessage] = useState('')

  const addNote = async () => {
    if (newEntryData.diagnostico === null) {
      setErrorMessage('Por favor, seleccione un diagnostico.')
    } else {
      setErrorMessage(null)
      let newNote = { ...newEntryData }
      if (modifyingNote.entry === '') {
        let lastEntryDate = 0
        if (patientData.patient.entradas.length > 0) {
          lastEntryDate = getDate(patientData.patient.entradas[0].fecha)
        }
        if (getCurrentDate() === lastEntryDate) {
          newNote = { ...newNote, entryId: patientData.patient.entradas[0]._id }
          newPatient.entradas[0].notas.push(newNote)
          updatePatient(newPatient)
          await postData('/entries/createNote', { newNote, centre: globalData.center, worker: globalData.worker._id, patient: patientData.patient._id })
        } else {
          const newEntry = {
            paciente: patientData.patient._id,
            fecha: new Date(),
            lenguaje: globalData.lenguage,
            trabajador: { id: globalData.worker._id, role: globalData.role },
            notas: [newNote]
          }
          newPatient.entradas.unshift(newEntry)
          await postData('/entries/createEntry', { newEntry, centre: globalData.center })
        }
      } else {
        const newNotes = newPatient.entradas[modifyingNote.entry].notas
        newNotes[modifyingNote.note] = newNote
        setRemovedDiagnosis((prev) => {
          if (prev === newNote.diagnostico._id) {
            return ''
          }
          updateNote('/entries/updateNote/' + patientData.patient.entradas[modifyingNote.entry]._id, { newNotes, centre: globalData.center, worker: globalData.worker._id, patient: patientData.patient._id, removedDiagnosis: prev })
          return prev
        })
      }
    }
  }

  const [newPatient2, setNewPatient2] = useState({ ...patientData.patient })

  const handleDeleteNote = () => {
    if (modifyingNote.entry === '') {
      setNewEntryData({
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
      setRecs()
    } else {
      const arr = [...newPatient.entradas[modifyingNote.entry].notas]
      arr.splice(modifyingNote.note, 1)
      if (arr.length === 0) {
        const newEntries = [...newPatient.entradas]
        newEntries.splice(modifyingNote.entry, 1)
        newPatient.entradas = newEntries
      } else newPatient.entradas[modifyingNote.entry].notas = arr
      deleteNote('/entries/deleteNote/' + patientData.patient.entradas[modifyingNote.entry]._id, { newNotes: arr, patient: patientData.patient._id, centre: globalData.center, worker: globalData.worker._id, removedDiagnosis })
      setNewPatient2(newPatient)
    }
  }

  useEffect(() => {
    if (dataRec) setRecs(dataRec)
  }, [dataRec])

  useEffect(() => {
    if (error) console.log(error.response.data)
    if (data) {
      if (data.data._id) newPatient.entradas[0]._id = data.data._id
      updatePatient(newPatient)
      setNewEntryData(() => {
        return {
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
        }
      })
      setPrincipalComponent('entries')
    }
  }, [error, data])

  useEffect(() => {
    if (errorUpdate) console.log(errorUpdate.response.data)
    if (dataUpdate) {
      updatePatient(newPatient)
      setNewEntryData(() => {
        return {
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
        }
      })
      setPrincipalComponent('entries')
    }
  }, [errorUpdate, dataUpdate])

  useEffect(() => {
    if (errorDelete) console.log(errorDelete.response.data)
    if (dataDelete) {
      updatePatient(newPatient2)
      setNewEntryData(() => {
        return {
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
        }
      })
      setPrincipalComponent('entries')
    }
  }, [errorDelete, dataDelete])

  const clickNote = (entry, note) => {
    setErrorMessage(null)
    setModifyingNote({ entry, note })
    const modNote = entries[entry].notas[note]
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
    console.log(modNote)
    setRemovedDiagnosis(modNote.diagnostico._id)
    setDiagnosisComponent(() => {
      if (status.active === 'active') {
        return <DiagnosisList updateSelectedDiagnosis={modNote.diagnostico.nombre} diagnosis={activeDiagnosis} filterDiagnosis={handleClickDiagnosis}/>
      }
      return <DiagnosisList updateSelectedDiagnosis={modNote.diagnostico.nombre} diagnosis={inactiveDiagnosis} filterDiagnosis={handleClickDiagnosis}/>
    })
    setPrincipalComponent('newEntry')
  }

  useEffect(() => {
    if (newEntryData.clinica) fetchRec('/entries/getDiagnosisRec', { clinica: newEntryData.clinica })
  }, [newEntryData.clinica])
  const openNewEntry = () => {
    if (modifyingNote.entry !== '') {
      setNewEntryData({
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
      setDiagnosisComponent(() => {
        if (status.active === 'active') {
          return <DiagnosisList updateSelectedDiagnosis={''} diagnosis={activeDiagnosis} filterDiagnosis={handleClickDiagnosis}/>
        }
        return <DiagnosisList updateSelectedDiagnosis={''} diagnosis={inactiveDiagnosis} filterDiagnosis={handleClickDiagnosis}/>
      })
      setRecs()
    } else {
      setDiagnosisComponent(() => {
        if (status.active === 'active') {
          return <DiagnosisList updateSelectedDiagnosis={newEntryData.diagnostico ? newEntryData.diagnostico.nombre : ''} diagnosis={activeDiagnosis} filterDiagnosis={handleClickDiagnosis}/>
        }
        return <DiagnosisList updateSelectedDiagnosis={newEntryData.diagnostico ? newEntryData.diagnostico.nombre : ''} diagnosis={inactiveDiagnosis} filterDiagnosis={handleClickDiagnosis}/>
      })
    }
    setModifyingNote({ entry: '', note: '' })
    setPrincipalComponent('newEntry')
  }

  const openEntries = () => {
    setStatus((prev) => {
      setDiagnosisComponent(() => {
        if (prev.active === 'active') {
          return <DiagnosisList updateSelectedDiagnosis={lastDiagnosis} diagnosis={activeDiagnosis} filterDiagnosis={handleClickDiagnosis}/>
        }
        return <DiagnosisList updateSelectedDiagnosis={lastDiagnosis} diagnosis={inactiveDiagnosis} filterDiagnosis={handleClickDiagnosis}/>
      })
      setPrincipalComponent('entries')
      return prev
    })
  }

  return (
    entries
      ? <div className="patient_entries">
        {
          !showAddPrescription
            ? <>
              <div className="patient_entries_container">
                <div className="navbar_entries">
                  <button onClick={openEntries} className={principalComponent === 'entries' ? 'button_tag active' : 'button_tag inactive'}>Notas previas</button>
                  <button onClick={openNewEntry} className={principalComponent === 'newEntry' ? 'button_tag active' : 'button_tag inactive'}>Añadir/modificar nota</button>
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
                        <div className="entryForm_save">
                        {
                          modifyingNote.entry === ''
                            ? <button type='button' onClick={handleDeleteNote} className='button_classic trash'><FontAwesomeIcon icon={faEraser}/></button>
                            : <button type='button' onClick={handleDeleteNote} className='button_classic trash'><FontAwesomeIcon icon={faTrash}/></button>
                        }
                        </div>
                        <div className="entryForm_anamsesio">
                          <div className="float_title">{leng.amnanesi}</div>
                          <label>{leng.motivo}</label>
                          <textarea name="motivo" id="" rows="2" onChange={({ target }) => setNewEntryData((prev) => { return { ...prev, motivo: target.value } })} value={newEntryData.motivo}></textarea>
                          <label>{leng.antecedentes}</label>
                          <textarea name="antecedentes" id="" rows="4" onChange={({ target }) => setNewEntryData((prev) => { return { ...prev, antecedentes: target.value } })} value={newEntryData.antecedentes}></textarea>
                          <label>{leng.clinica}</label>
                          <textarea name="clinica" id="" rows="4" onChange={({ target }) => setNewEntryData((prev) => { return { ...prev, clinica: target.value } })} value={newEntryData.clinica}></textarea>
                        </div>
                        <div className="entryForm_exploracion">
                          <div className="float_title">{leng.exploracion}</div>
                          <label>{leng.descripcion}</label>
                          <textarea name="exploracion" id="" rows="4" onChange={({ target }) => setNewEntryData((prev) => { return { ...prev, exploracion: target.value } })} value={newEntryData.exploracion}></textarea>
                          <label>{leng.pruebas}</label>
                          <textarea name="exploracion" id="" rows="4" onChange={({ target }) => setNewEntryData((prev) => { return { ...prev, pruebasComplementarias: target.value } })} value={newEntryData.pruebasComplementarias}></textarea>
                        </div>
                        <div className="entryForm_diagnostico">
                          <div className="float_title">{leng.orientacion}</div>
                          <label>{leng.diagnostico}</label>
                          <div className="search">
                            <div className="diagnosis">{newEntryData.diagnostico ? newEntryData.diagnostico.nombre : '' }</div>
                            <button type='button' onClick={() => { setSearch(true) }} className='search_button'><FontAwesomeIcon icon={faMagnifyingGlass}/></button>
                          </div>
                          {
                            recs && recs.length > 0 && modifyingNote.entry === ''
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
                          <textarea name="desc_diagnostico" id="" rows="4" onChange={({ target }) => setNewEntryData((prev) => { return { ...prev, descDiagnostico: target.value } })} value={newEntryData.descDiagnostico}></textarea>
                        </div>
                        <div className="entryForm_plan_terapeutico">
                          <div className="float_title">{leng.plan}</div>
                          <label>{leng.descripcion}</label>
                          <textarea name="desc_diagnostico" id="" rows="4" onChange={({ target }) => setNewEntryData((prev) => { return { ...prev, planTerapeutico: target.value } })} value={newEntryData.planTerapeutico}></textarea>
                          {
                            modifyingNote.entry === ''
                              ? <>
                              <label>{leng.prescripciones}</label>
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
                                      <div className='no_prescriptions'>{leng.noPres}</div>
                                  </>
                                }
                              </>
                              : null
                          }
                          <div className="plan_options">
                            <button className='button_classic' onClick={() => {}}>{leng.derivar}</button>
                            <button className='capsules_button' onClick={() => { setShowAddPrescription(true) }}><FontAwesomeIcon className='icon' icon={faCapsules}/></button>
                          </div>
                        </div>
                        <div className="entryForm_save">
                          {
                            errormessage
                              ? <div className="error"><p className="error_message">{errormessage}</p></div>
                              : null
                          }
                          <button type='button' className='button_classic' onClick={addNote}>{leng.guardar}</button>
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
            : <AddPrescription diagnosis={newEntryData.diagnostico} addPrescription={addPrescription} quitAddPrescription={quitAddPrescription}/>
        }
      </div>
      : null
  )
}

export default PatientEntries
