import { useState } from 'react'
import { useGlobalContext } from './useGlobalContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const useFetch = (url) => {
  const [data, setData] = useState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const { globalData } = useGlobalContext()
  const navigate = useNavigate()
  const fetchData = async (url, params) => {
    setLoading(true)
    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${globalData.token}`
        },
        params
      }).then((response) => {
        setData(response.data)
      })
      return res
    } catch (error) {
      if (error.request.status === 403) navigate('/app/login')
      setError(error)
    }
    setLoading(false)
  }

  return { fetchData, data, loading, error }
}

export default useFetch
