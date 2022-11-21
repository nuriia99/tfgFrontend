import { React, useEffect, useState } from 'react'
import PatientEntry from './PatientEntry'
import { useGlobalContext } from '../../../hooks/useGlobalContext'
import { getLenguage } from '../../../utils/lenguage'
import DiagnosisList from './DiagnosisList'
import { usePatientContext } from '../../../hooks/usePatientContext'

const PatientEntries = ({ info }) => {
  const { globalData } = useGlobalContext()
  const { patientData } = usePatientContext()
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

  const filterDiagnosis = (diagnosis) => {
    if (diagnosis === lastDiagnosis) {
      setEntries(allEntries)
      lastDiagnosis = ''
    } else {
      const newEntries = []
      allEntries.forEach((entry) => {
        entry.notas.forEach(nota => {
          if (nota.diagnostico.nombre === diagnosis) newEntries.push(entry)
        })
      })
      setEntries(newEntries)
      lastDiagnosis = diagnosis
    }
  }

  const handleActive = (e) => {
    const name = e.target.name
    setDiagnosisComponent(() => {
      if (name === 'active') {
        setStatus(() => {
          return { active: 'active', inactive: 'inactive' }
        })
        return <DiagnosisList diagnosis={activeDiagnosis} filterDiagnosis={filterDiagnosis}/>
      }
      setStatus(() => {
        return { active: 'inactive', inactive: 'active' }
      })
      return <DiagnosisList diagnosis={inactiveDiagnosis} filterDiagnosis={filterDiagnosis}/>
    })
  }
  useEffect(() => {
    if (patientData.patient) {
      setAllEntries(patientData.patient.entradas)
      setEntries(patientData.patient.entradas)
      patientData.patient.entradas.map((entry) => {
        return entry.notas.map(nota => {
          return nota.estado === 'activo' ? setActiveDiagnosis(prev => [...prev, { nombre: nota.diagnostico.nombre, severidad: nota.diagnostico.severidad }]) : setInactiveDiagnosis(prev => [...prev, { nombre: nota.diagnostico.nombre, severidad: nota.diagnostico.severidad }])
        })
      })
    }
  }, [patientData])
  useEffect(() => {
    setDiagnosisComponent(<DiagnosisList diagnosis={activeDiagnosis} filterDiagnosis={filterDiagnosis}/>)
  }, [activeDiagnosis])

  return (
    entries
      ? <div className="patient_entries">
        <div className="patient_entries_container">
          <div className="navbar_entries">
            <button onClick={() => setPrincipalComponent('entries')} className={principalComponent === 'entries' ? 'button_tag active' : 'button_tag inactive'}>Notas previas</button>
            <button onClick={() => setPrincipalComponent('newEntry')} className={principalComponent === 'newEntry' ? 'button_tag active' : 'button_tag inactive'}>Añadir nota</button>
          </div>
          {
            principalComponent === 'entries'
              ? <>
              <div className="patient_entries_container_list">
              {
                entries.map((entry) => {
                  return (
                    <PatientEntry key={entry._id} entry={entry}></PatientEntry>
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
                <form action="">
                  <div className="entryForm">
                    <label>Motivo de la visita</label>
                    <textarea name="motivo" id="" cols="30" rows="10"></textarea>
                    <label>Exploración</label>
                    <textarea name="exploracion" id="" cols="30" rows="10"></textarea>
                    <label>Tratatamiento</label>
                    <textarea name="tratamiento" id="" cols="30" rows="10"></textarea>
                  </div>
                </form>
              </div>
              </>
          }
        </div>
      </div>
      : null
  )
}

export default PatientEntries
