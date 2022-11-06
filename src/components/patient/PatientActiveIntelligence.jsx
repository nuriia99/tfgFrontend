import { React } from 'react'
import { useGlobalContext } from '../../hooks/useGlobalContext'
import { getLenguage } from '../../services/lenguage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { getCurrentDate } from '../../services/utils'

const PatientActiveIntelligence = ({ ai, handleClick }) => {
  const { globalData } = useGlobalContext()
  const leng = getLenguage(globalData.lenguage, 'patient')
  const actualDate = getCurrentDate()
  console.log(ai)
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
    Drogas: leng.drogas
  }

  return (
    <div className='patient_ai_panel'>
      <div className='patient_ai_panel_container'>
        <button className='patient_ai_panel_container_button' onClick={handleClick}><FontAwesomeIcon className='icon' icon={faArrowLeft}/></button>
        <div className='patient_ai_table'>
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
                      }
                      return <div key={index} className='dates'>{column}</div>
                    })}
                    <div className='currentDate'>{actualDate}</div>
                  </div>
                )
              } else {
                let lastValue = ''
                return (
                  <div className='patient_ai_table_row' key={index}>
                    {row.map((column, index) => {
                      if (index === 0) {
                        return (
                          <div key={index} className='fixed_names'>{names[column.replace(/\s+/g, '')]}</div>
                        )
                      } else {
                        if (column !== '-') {
                          lastValue = column
                          return (
                            <div key={index} className='values'>{column}</div>
                          )
                        }
                        return <div key={index} className='values'></div>
                      }
                    })}
                    <div key={index} className='fixed_values'>{lastValue}</div>
                  </div>
                )
              }
            })
          }
        </div>
      </div>
    </div>
  )
}

export default PatientActiveIntelligence
