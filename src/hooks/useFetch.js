import { useEffect, useState } from "react"
import { useGlobalContext } from "./useGlobalContext"
import axios from 'axios'

const useFetch =  (url) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const { globalData } = useGlobalContext()
  useEffect( () => {
    const fetchData = async () => {
      setLoading(true)
      try{
        await axios.get(url,{
          headers: {
            'Authoritation' : `Bearer ${globalData.token}`
          }
        }).then((response) => {
            setData(response.data)
          });
        
      }catch (error) {
        setError(error)
      }
      setLoading(false)
    }
    fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url])


  const reFetch = async () => {
    setLoading(true)
    try{
      const res = axios.get(url)
      setData(res.data)
    }catch (error) {
      setError(error)
    }
    setLoading(false)
  }

  return {data, loading, error, reFetch}
}


export default useFetch