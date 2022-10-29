import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useGlobalContext } from './useGlobalContext'

export const useLogin = () => {
  const [loading, setLoading] = useState(null)
  const [error, setError] = useState(null)
  const { updateWorker, updateData } = useGlobalContext()
  const navigate = useNavigate()

  const login = async (username, password) => {
    setLoading(true)
    setError(null)
    await axios.post('/auth/login', { username, password })
      .then((response) => {
        const { workerData, token } = response.data
        updateWorker({ workerData, token })
        updateData({ worker: workerData, token, center: workerData.turno.centro, lenguage: workerData.lenguaje, role: workerData.turno.rol })
        setLoading(false)

        navigate('/home')
      })
      .catch((e) => {
        setLoading(false)
        if (e.response.request.status === 404) {
          setError('El usuario no existe!')
        } else if (e.response.request.status === 400) {
          setError('La contraseña es incorrecta!')
        } else {
          setError('Ha surgido un error inesperado.')
        }
      })
  }

  return { login, loading, error }
}
