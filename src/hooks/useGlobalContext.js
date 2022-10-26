import { useContext } from "react";
import globalContext from "../context/globalContext";
import {useNavigate} from 'react-router-dom'


export const useGlobalContext = () => {
  const { dispatch } = useContext(globalContext)
  const navigate = useNavigate()
  
  const {globalData} = useContext(globalContext)

  const updateWorker  = (data) => {
    dispatch({type:'UPDATEWORKER', payload: data})
  }

  const updateCenter  = (data) => {
    dispatch({type:'UPDATECENTER', payload: data})
  }

  const updateLenguage  = (data) => {
    //falta añadir la query
    dispatch({type:'UPDATELENGUAGE', payload: data})
  }

  const updateRole  = (data) => {
    dispatch({type:'UPDATEROLE', payload: data})
  }

  const reset  = () => {
    dispatch({type:'RESET'})
    navigate('/login')
  }

  return {globalData, updateWorker, updateCenter, updateLenguage, updateRole, reset}
}