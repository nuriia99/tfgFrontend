import { React, createContext, useEffect, useReducer } from 'react'

const INITIAL_STATE = {
  worker: null,
  token: null,
  lenguage: null,
  center: null,
  schedule: null,
  schedules: null,
  report: null,
  role: null
}

const globalContext = createContext(INITIAL_STATE)

export const globalReducer = (state, action) => {
  const newWorker = state.worker
  switch (action.type) {
    case 'UPDATEWORKER':
      return { ...state, worker: action.payload.workerData, token: action.payload.token }
    case 'UPDATELENGUAGE':
      newWorker.lenguaje = action.payload
      return { ...state, worker: newWorker, lenguage: action.payload }
    case 'UPDATECENTER':
      return { ...state, center: action.payload }
    case 'UPDATEROLE':
      return { ...state, role: action.payload }
    case 'UPDATESCHEDULE':
      return { ...state, schedule: action.payload }
    case 'UPDATESCHEDULES':
      return { ...state, schedules: action.payload }
    case 'UPDATEREPORT':
      return { ...state, report: action.payload }
    case 'RESET':
      return INITIAL_STATE
    default:
      return INITIAL_STATE
  }
}

export const GlobalContextProvider = ({ children }) => {
  const [globalData, dispatch] = useReducer(globalReducer, JSON.parse(localStorage.getItem('globalContext')) || INITIAL_STATE)

  useEffect(() => {
    window.localStorage.setItem('globalContext', JSON.stringify(globalData))
  }, [globalData])

  return (
    <globalContext.Provider value={{ globalData, dispatch }}>
      {children}
    </globalContext.Provider>
  )
}

export default globalContext
