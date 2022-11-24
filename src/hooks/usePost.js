import { useState } from 'react'
import { useGlobalContext } from './useGlobalContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const usePost = (url) => {
  const [data, setData] = useState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const { globalData } = useGlobalContext()
  const navigate = useNavigate()

  const postData = async (url, params) => {
    setLoading(true)
    setError(false)
    setData()
    try {
      await axios.post(url, params, {
        headers: {
          Authorization: `Bearer ${globalData.token}`
        }
      }).then((response) => {
        setData(response)
      })
    } catch (error) {
      if (error.request.status === 403) navigate('/app/login')
      setError(error)
    }
    setLoading(false)
  }

  return { postData, data, loading, error }
}

export default usePost
