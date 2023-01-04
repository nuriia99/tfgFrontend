import { useState } from 'react'
import { useGlobalContext } from './useGlobalContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const useDelete = (url) => {
  const [data, setData] = useState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const { globalData } = useGlobalContext()
  const navigate = useNavigate()

  const deleteData = async (url, params) => {
    setLoading(true)
    setError(false)
    setData()
    try {
      await axios.delete('https://tfg-sistema-sanitario-upc-backend.onrender.com' + url, {
        headers: {
          Authorization: `Bearer ${globalData.token}`
        },
        data: params
      }).then((response) => {
        setData(response)
      })
    } catch (error) {
      if (error.request.status === 403) navigate('/app/login')
      setError(error)
    }
    setLoading(false)
  }

  return { deleteData, data, loading, error }
}

export default useDelete
