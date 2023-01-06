import { React, useEffect, useState } from 'react'
import { useGlobalContext } from '../../../hooks/useGlobalContext'
import { getLenguage } from '../../../utils/lenguage'
import { getCurrentDate } from '../../../utils/utils'
import { usePatientContext } from '../../../hooks/usePatientContext'

const PatientActiveIntelligence = ({ handleClick }) => {
  const { globalData } = useGlobalContext()
  const { patientData } = usePatientContext()
  const leng = getLenguage(globalData.lenguage, 'patient')
  const actualDate = getCurrentDate()
  const [ai, setAi] = useState()

  useEffect(() => {
    setAi(patientData.patient.inteligenciaActiva)
  }, [patientData])

  const names = {
    Tabaquismo: leng.tabaquismo,
    ActividadFisica: leng.actividadFisica,
    ValoracionPacientesCronicos: leng.cronicos,
    FrecuenciaCardiaca: leng.frecCardiaca,
    Peso: leng.peso,
    Estatura: leng.estatura,
    ColesterolTotal: leng.colesterol,
    Alergias: leng.alergias,
    Alcohol: leng.alcohol,
    Drogas: leng.drogas,
    TensionArterial: leng.tension,
    GlucemiaCapilar: leng.glucemia,
    SaturacionOxigeno: leng.saturacion
  }
  return (
    ai
      ? <div className='patient_ai_panel_container'>
          <div className='patient_ai_table hide-for-mobile'>
            {
              ai.map((row, index) => {
                if (index === 0) {
                  // primera fila
                  return (
                    <div className='patient_ai_table_row' key={index}>
                      {row.map((column, index) => {
                        if (index === 0) {
                          if (column === '-') return <div key={index} className='fixed title'>{leng.inteligenciaActiva}</div>
                          return <div key={index} className='fixed title'>{column}</div>
                        } else if (index === row.length - 1) {
                          return <div key={index} className='currentDate'>{actualDate}</div>
                        }
                        return <div key={index} className='dates'>{column}</div>
                      })}
                    </div>
                  )
                } else {
                  return (
                    <div className='patient_ai_table_row' key={index}>
                      {row.map((column, index) => {
                        if (index === 0) {
                          return (
                            <div key={index} className='fixed_names'>{names[column.replace(/\s+/g, '')]}</div>
                          )
                        } else if (index === row.length - 1) {
                          return <div key={index} className='fixed_values'>{column !== '-' ? column : ''}</div>
                        } else {
                          if (column !== '-') {
                            return (
                              <div key={index} className='values'>{column}</div>
                            )
                          }
                          return <div key={index} className='values'></div>
                        }
                      })}
                    </div>
                  )
                }
              })
            }
          </div>
          <div className="patient_ai_table hide-for-desktop">
            <div className="classic_table">
              <table>
                <thead>
                  <tr>
                    <th>{leng.inteligenciaActiva}</th>
                    <th>Valor</th>
                  </tr>
                </thead>
                <tbody>
                {
                  ai.map((row, index) => {
                    if (index !== 0) {
                      const name = names[row[0].replace(/\s+/g, '')]
                      const value = row.at(-1) !== '-' ? row.at(-1) : ''
                      return (
                        <tr key={index}>
                          <td>{name}</td>
                          <td>{value}</td>
                        </tr>
                      )
                    } else return null
                  })
                }
                </tbody>
              </table>
              {
                ai.length < 1
                  ? <>
                    <div className='empty'>{leng.empty}</div>
                  </>
                  : null
              }
            </div>
          </div>
        </div>
      : null
  )
}

export default PatientActiveIntelligence
