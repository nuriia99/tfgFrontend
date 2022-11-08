import { React, useEffect, useState } from 'react'
import { getEntries } from '../../services/entries'
import PatientEntry from './PatientEntry'
import { useGlobalContext } from '../../hooks/useGlobalContext'
import { getLenguage } from '../../services/lenguage'
import DiagnosisList from './DiagnosisList'

const PatientEntries = ({ info }) => {
  const { globalData } = useGlobalContext()
  const leng = getLenguage(globalData.lenguage, 'patient')
  const [loading, setLoading] = useState(false)
  const [allEntries, setAllEntries] = useState()
  const [entries, setEntries] = useState()
  const [diagnosisComponent, setDiagnosisComponent] = useState()
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
          if (nota.diagnostico === diagnosis) newEntries.push(entry)
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
    if (info) {
      const fetchData = async () => {
        setLoading(true)
        const data = await getEntries({ id: info.id, token: info.token })
        setAllEntries(data)
        setEntries(data)
        data.map((entry) => {
          return entry.notas.map(nota => {
            return nota.estado === 'activo' ? setActiveDiagnosis(prev => [...prev, { nombre: nota.diagnostico, severidad: nota.severidad }]) : setInactiveDiagnosis(prev => [...prev, { nombre: nota.diagnostico, severidad: nota.severidad }])
          })
        })
        setLoading(false)
      }
      fetchData()
    }
  }, [])
  useEffect(() => {
    setDiagnosisComponent(<DiagnosisList diagnosis={activeDiagnosis} filterDiagnosis={filterDiagnosis}/>)
  }, [activeDiagnosis])
  return (
    !loading
      ? <>
      {
        entries
          ? <div className="patient_entries">
            <div className="patient_entries_container">
              <div className="patient_entries_container_list">
                {
                  entries.map((entry, index) => {
                    return (
                      <PatientEntry key={index} entry={entry}></PatientEntry>
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
            </div>
          </div>
          : null
      }
      </>
      : null
  )
}

export default PatientEntries
