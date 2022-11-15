import { useState } from 'react'
import { useGlobalContext } from './useGlobalContext'
import axios from 'axios'

const usePost = (url) => {
  const [data, setData] = useState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const { globalData } = useGlobalContext()

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
        setData(response.data)
      })
    } catch (error) {
      setError(error)
    }
    setLoading(false)
  }

  return { postData, data, loading, error }
}

export default usePost
