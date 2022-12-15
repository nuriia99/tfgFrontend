import { React, useEffect } from 'react'
import Navbar from '../../components/navbar/Navbar'
import { useGlobalContext } from '../../hooks/useGlobalContext'
import { useNavigate } from 'react-router-dom'
import ListsContainer from '../../components/statistics/ListsContainer'

const Lists = () => {
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
      <ListsContainer/>
    </div>
      : null
  )
}

export default Lists
