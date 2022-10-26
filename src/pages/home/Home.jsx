import {React, useEffect} from 'react'
import useFetch from '../../hooks/useFetch.js'
import Navbar from '../../components/navbar/Navbar'
import {useGlobalContext}  from '../../hooks/useGlobalContext'
import {useNavigate} from 'react-router-dom'

const Home = () => {
  const {globalData} = useGlobalContext() 
  const navigate = useNavigate()
  const {isLoading, error} = useFetch('/home')
  useEffect(() => {
    if(error) navigate('/login')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading])
  const {worker} = globalData

  return (
    
    !isLoading && worker ? <div>
      <Navbar/>
    </div> : <div></div>
    
      
  )
}

export default Home
