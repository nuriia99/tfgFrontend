import { useContext } from 'react'
import globalContext from '../context/globalContext'
import { useNavigate } from 'react-router-dom'

export const useGlobalContext = () => {
  const { globalData, dispatch } = useContext(globalContext)
  const navigate = useNavigate()

  const updateWorker = (data) => {
    dispatch({ type: 'UPDATEWORKER', payload: data })
  }

  const updateData = async (data) => {
    if (data.center) dispatch({ type: 'UPDATECENTER', payload: data.center })
    if (data.lenguage) dispatch({ type: 'UPDATELENGUAGE', payload: data.lenguage })
    if (data.role) dispatch({ type: 'UPDATEROLE', payload: data.role })
    if (data.schedule) dispatch({ type: 'UPDATESCHEDULE', payload: data.schedule })
    if (data.schedules) dispatch({ type: 'UPDATESCHEDULES', payload: data.schedules })
    if (data.report) dispatch({ type: 'UPDATEREPORT', payload: data.report })
  }

  const reset = () => {
    dispatch({ type: 'RESET' })
    navigate('/app/login')
  }
  return { globalData, updateWorker, updateData, reset }
}
