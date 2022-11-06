import { React, useEffect, useState } from 'react'
import { getEntries } from '../../services/entries'
import PatientEntry from './PatientEntry'

const PatientEntries = ({ info }) => {
  const [loading, setLoading] = useState(false)
  const [entries, setEntries] = useState()
  useEffect(() => {
    if (info) {
      const fetchData = async () => {
        setLoading(true)
        const data = await getEntries({ id: info.id, token: info.token })
        setEntries(data)
        setLoading(false)
      }
      fetchData()
    }
  }, [])

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
              <div className="patient_entries_container_diagnosis"></div>
            </div>
          </div>
          : null
      }
      </>
      : null
  )
}

export default PatientEntries
