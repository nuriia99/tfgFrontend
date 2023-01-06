import { React, useState, useEffect } from 'react'
import { useGlobalContext } from '../../../hooks/useGlobalContext'
import { usePatientContext } from '../../../hooks/usePatientContext'
import { getLenguage } from '../../../utils/lenguage'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

const VisitsCard = ({ handleClickPrincipalComponent }) => {
  const { globalData } = useGlobalContext()
  const { patientData } = usePatientContext()
  const leng = getLenguage(globalData.lenguage, 'patient')

  const [appoitnments, setAppointments] = useState(patientData.patient.citasPrevias)

  useEffect(() => {
    setAppointments(patientData.patient.citasPrevias)
  }, [patientData])

  return (
    <>
      <div className="panel">
        {
          appoitnments
            ? <>
              <div className="classic_table no_selected_rows">
                <table>
                  <thead>
                    <tr>
                      <th>
                        <div className='row'>
                          <p>{leng.visitasActuales}</p>
                          <button id='visits_button' name='visits_button' onClick={() => handleClickPrincipalComponent('visits_button')} className='button_plus'><FontAwesomeIcon id='prescriptions_button' name='prescriptions_button' className='icon' icon={faPlus}/></button>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      appoitnments.map((cita, index) => {
                        return (
                          <tr key={index}>
                            <td>{cita.especialidad}</td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
                {
                  appoitnments.length < 1
                    ? <>
                      <div className='empty'>{leng.empty}</div>
                    </>
                    : null
                }
              </div>
            </>
            : null
        }
      </div>
    </>
  )
}

export default VisitsCard
