import { React, createContext, useEffect, useReducer } from 'react'
import CryptoJS from 'crypto-js'

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
  const [globalData, dispatch] = useReducer(globalReducer, localStorage.getItem('globalContext') ? JSON.parse(CryptoJS.AES.decrypt(localStorage.getItem('globalContext'), process.env.REACT_APP_CRYPT_WORD).toString(CryptoJS.enc.Utf8)) : INITIAL_STATE)

  useEffect(() => {
    window.localStorage.setItem('globalContext', CryptoJS.AES.encrypt(JSON.stringify(globalData), process.env.REACT_APP_CRYPT_WORD).toString())
  }, [globalData])

  return (
    <globalContext.Provider value={{ globalData, dispatch }}>
      {children}
    </globalContext.Provider>
  )
}

export default globalContext
