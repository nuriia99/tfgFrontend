import { useContext } from 'react'
import globalContext from '../context/globalContext'
import { useNavigate } from 'react-router-dom'

export const useGlobalContext = () => {
  const { dispatch } = useContext(globalContext)
  const navigate = useNavigate()
  const { globalData } = useContext(globalContext)

  const updateWorker = (data) => {
    dispatch({ type: 'UPDATEWORKER', payload: data })
  }

  const updatePatient = (data) => {
    dispatch({ type: 'UPDATEPATIENT', payload: data })
  }

  const updateEntries = (data) => {
    dispatch({ type: 'UPDATEENTRIES', payload: data })
  }

  const updateData = async (data) => {
    dispatch({ type: 'UPDATECENTER', payload: data.center })
    dispatch({ type: 'UPDATELENGUAGE', payload: data.lenguage })
    dispatch({ type: 'UPDATEROLE', payload: data.role })
  }

  const reset = () => {
    dispatch({ type: 'RESET' })
    navigate('/app/login')
  }
  return { globalData, updateWorker, updateData, reset, updatePatient, updateEntries }
}
