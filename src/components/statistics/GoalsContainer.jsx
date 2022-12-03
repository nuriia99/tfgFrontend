import { React, useState } from 'react'
import GoalInfo from './GoalInfo'
import GoalPatients from './GoalPatients'
import GoalsList from './GoalsList'

const GoalsContainer = () => {
  const [principalComponent, setPrincipalComponent] = useState('listGoals')
  const [goal, setGoal] = useState()

  const handleClickCode = (goal) => {
    setGoal(goal)
    setPrincipalComponent('goalInfo')
  }

  const handleClickName = (goal) => {
    setGoal(goal)
    setPrincipalComponent('goalPatients')
  }

  const handleBack = () => {
    setPrincipalComponent('listGoals')
  }

  return (
    <>
      {
        {
          listGoals: <GoalsList handleClickCode={handleClickCode} handleClickName={handleClickName}/>,
          goalInfo: <GoalInfo goal={goal} handleBack={handleBack}/>,
          goalPatients: <GoalPatients goal={goal} handleBack={handleBack}/>
        }[principalComponent]
      }
    </>
  )
}

export default GoalsContainer
