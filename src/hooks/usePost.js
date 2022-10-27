import { useEffect, useState } from "react"
import { useGlobalContext } from "./useGlobalContext"
import axios from 'axios'

const usePost =  (url, data, token) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { globalData } = useGlobalContext()
  const postData = async () => {
    setLoading(true)
    try{
      await axios.get(url,{
        headers: {
          'Authoritation' : `Bearer ${token}`
        }
      }).then((response) => {
          //
        });
      
    }catch (error) {
      setError(error)
    }
    setLoading(false)
  }


  useEffect( () => {
    postData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, data])

  return {loading, error}
}


export default usePost