import { React } from 'react'
import { useGlobalContext } from '../../hooks/useGlobalContext'
import { getLenguage } from '../../services/lenguage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

const PatientActiveIntelligence = ({ ai, handleClick }) => {
  const { globalData } = useGlobalContext()
  const leng = getLenguage(globalData.lenguage, 'patient')
  const d = new Date()
  let day = d.getDay()
  if (day < 10) day = '0' + day
  let month = d.getMonth()
  if (month < 10) month = '0' + month
  const actualDate = day + '/' + month + '/' + d.getFullYear()

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
  console.log(ai)
  return (
    <div className='patient_ai_panel'>
      <div className='patient_ai_panel_container'>
        <button className='patient_ai_panel_container_button' onClick={handleClick}><FontAwesomeIcon className='icon' icon={faArrowLeft}/></button>
        <table className='patient_ai_table'>
          {
            ai.map((row, index) => {
              if (index === 0) {
                // primera fila
                return (
                  <tr key={index}>
                    {row.map((column, index) => {
                      if (index === 0) {
                        if (column === '-') return <th key={index} className='fixed title'>{leng.inteligenciaActiva}</th>
                        return <th key={index} className='fixed title'>{column}</th>
                      }
                      return <th key={index} className='dates'>{column}</th>
                    })}
                    <th className='currentDate'>{actualDate}</th>
                  </tr>
                )
              } else {
                let lastValue = ''
                return (
                  <tr key={index}>
                    {row.map((column, index) => {
                      if (index === 0) {
                        return (
                          <tr key={index}>
                            <th key={index} className='fixed names'>{names[column.replace(/\s+/g, '')]}</th>
                          </tr>
                        )
                      } else {
                        if (column !== '-') {
                          lastValue = column
                          return (
                            <td key={index} className='values'>{column}</td>
                          )
                        }
                        return <td key={index}></td>
                      }
                    })}
                    <td key={index} className='fixed_values'>{lastValue}</td>
                  </tr>
                )
              }
            })
          }
        </table>
      </div>
    </div>
  )
}

export default PatientActiveIntelligence
