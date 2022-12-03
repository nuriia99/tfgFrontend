import { React, useEffect } from 'react'
import Navbar from '../../components/navbar/Navbar'
import { useGlobalContext } from '../../hooks/useGlobalContext'
import { useNavigate } from 'react-router-dom'
import GoalsContainer from '../../components/statistics/GoalsContainer'

const Goals = () => {
  const { globalData } = useGlobalContext()
  const { worker } = globalData
  const navigate = useNavigate()
  useEffect(() => {
    if (!worker) navigate('/app/login')
  }, [])

  return (
    worker
      ? <div>
      <Navbar/>
      <GoalsContainer/>
    </div>
      : null
  )
}

export default Goals
