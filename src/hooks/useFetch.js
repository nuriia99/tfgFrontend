import { useState } from 'react'
import { useGlobalContext } from './useGlobalContext'
import axios from 'axios'

const useFetch = (url) => {
  const [data, setData] = useState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const { globalData } = useGlobalContext()

  const fetchData = async (url) => {
    setLoading(true)
    try {
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${globalData.token}`
        }
      }).then((response) => {
        setData(response.data)
      })
      return res
    } catch (error) {
      console.log(error)
      setError(error)
    }
    setLoading(false)
  }

  return { fetchData, data, loading, error }
}

export default useFetch
