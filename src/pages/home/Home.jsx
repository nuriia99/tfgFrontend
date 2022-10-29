import { React, useEffect } from 'react'
import Navbar from '../../components/navbar/Navbar'
import { useGlobalContext } from '../../hooks/useGlobalContext'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const { globalData } = useGlobalContext()
  const { worker } = globalData
  const navigate = useNavigate()
  useEffect(() => {
    if (!worker) navigate('/login')
  }, [])
  return (
    worker
      ? <div>
      <Navbar/>
    </div>
      : null
  )
}

export default Home
