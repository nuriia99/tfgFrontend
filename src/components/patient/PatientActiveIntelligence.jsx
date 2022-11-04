import { React } from 'react'

const PatientActiveIntelligence = ({ ai, handleClick }) => {
  console.log(ai)
  return (
    <div className='patient_ai_panel'>
      <div className='patient_ai_panel_container'>
        <table className='patient_ai_table'>
          {
            ai.map((row, index) => {
              if (index === 0) {
                // primera fila
                return (
                  <tr key={index}>
                    {row.map((column, index) => {
                      if (index === 0) {
                        return <th key={index} className='fixed title'>{column}</th>
                      }
                      return <th key={index} className='dates'>{column}</th>
                    })}
                  </tr>
                )
              } else {
                return (
                  <tr key={index}>
                    {row.map((column, index) => {
                      if (index === 0) {
                        return (
                          <tr key={index}>
                            <th key={index} className='fixed names'>{column}</th>
                          </tr>
                        )
                      } else {
                        if (column !== '-') {
                          return (
                            <td key={index} className='values'>{column}</td>
                          )
                        }
                        return <td key={index}></td>
                      }
                    })}
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
