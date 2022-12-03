import { React } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { getLenguage } from '../../utils/lenguage'
import { useGlobalContext } from '../../hooks/useGlobalContext'

const GoalInfo = ({ goal, handleBack }) => {
  const { globalData } = useGlobalContext()
  const leng = getLenguage(globalData.lenguage, 'statistics')
  return (
    <>
      <div className="infoGoal">
        <div className="exit">
          <button onClick={handleBack} className='button_classic'><FontAwesomeIcon className='icon' icon={faArrowRightFromBracket}/></button>
        </div>
        <div className="infoGoal_container">
          <div className="infoGoal_container_name">
            <h3>{goal.codigo} - {goal.nombre}</h3>
          </div>
          <h4>{leng.desripcion}</h4>
          <p>{goal.descripcion}</p>
          <h4>{leng.definicion}</h4>
          <p>{goal.definicion}</p>
          <h4>{leng.medicamentos}</h4>
          {
            goal.medicamentos.map((med, index) => {
              return <p key={index}>{med}</p>
            })
          }
        </div>
      </div>
    </>
  )
}

export default GoalInfo
