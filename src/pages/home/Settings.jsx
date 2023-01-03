import { React, useEffect } from 'react'
import ProfileSettings from '../../components/home/ProfileSettings'
import Navbar from '../../components/navbar/Navbar'
import { useGlobalContext } from '../../hooks/useGlobalContext'
import { useNavigate } from 'react-router-dom'

const Settings = () => {
  const { globalData } = useGlobalContext()
  const { worker } = globalData
  const navigate = useNavigate()
  useEffect(() => {
    if (!worker) navigate('/app/login')
  }, [])
  return (
    worker
      ? <>
      <Navbar/>
      <ProfileSettings />
    </>
      : null
  )
}

export default Settings
