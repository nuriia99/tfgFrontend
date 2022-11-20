import { useState } from 'react'
import { useGlobalContext } from './useGlobalContext'
import axios from 'axios'

const usePatch = (url) => {
  const [data, setData] = useState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const { globalData } = useGlobalContext()

  const patchData = async (url, params) => {
    setLoading(true)
    setError(false)
    setData()
    try {
      await axios.patch(url, params, {
        headers: {
          Authorization: `Bearer ${globalData.token}`
        }
      }).then((response) => {
        setData(response)
      })
    } catch (error) {
      setError(error)
    }
    setLoading(false)
  }

  return { patchData, data, loading, error }
}

export default usePatch
