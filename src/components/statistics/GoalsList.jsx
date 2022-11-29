import { React } from 'react'
import { useGlobalContext } from '../../hooks/useGlobalContext'

const GoalsList = () => {
  const { globalData } = useGlobalContext()
  const { worker } = globalData
  console.log(worker)

  return (
    <>
    <div className="goals">
      <div className="goals_goal">
        <div className="goals_goal_name">Conseguir x</div>
      </div>
    </div>
    </>
  )
}

export default GoalsList
