import { React, useState } from 'react'
import { useGlobalContext } from '../../hooks/useGlobalContext'
import { updateLenguage } from '../../services/worker'
import { getLenguage } from '../../services/lenguage'
import { Select, Option } from './Select'

const ProfileSettings = () => {
  const lenguages = ['Español', 'Catalán']
  const { globalData, updateData, reset } = useGlobalContext()
  let leng = getLenguage(globalData.lenguage, 'settings')
  const [currentData, setCurrentData] = useState({
    currentCenter: globalData.center,
    optionsCenter: globalData.worker.centros.filter((item) => item !== globalData.center),
    currentRole: globalData.role,
    optionsRole: globalData.worker.especialidades.filter((item) => item !== globalData.role),
    currentLenguage: globalData.worker.lenguaje === 'es' ? 'Español' : 'Catalán',
    optionsLenguage: lenguages.filter((item) => item !== (globalData.worker.lenguaje === 'es' ? 'Español' : 'Catalán'))
  })

  const handleLogout = () => {
    reset()
  }

  const handleChange = (info) => {
    setCurrentData((prev) => {
      const currentValue = info.option
      if (info.name === 'center') {
        const options = globalData.worker.centros.filter((item) => item !== currentValue)
        return { ...prev, currentCenter: currentValue, optionsCenter: options }
      } else if (info.name === 'role') {
        const options = globalData.worker.especialidades.filter((item) => item !== currentValue)
        return { ...prev, currentRole: currentValue, optionsRole: options }
      } else {
        const options = lenguages.filter((item) => item !== currentValue)
        return { ...prev, currentLenguage: currentValue, optionsLenguage: options }
      }
    })
  }

  const [correct, setCorrect] = useState(null)
  const [loading, setLoading] = useState(null)
  const [message, setMessage] = useState(null)

  const handleSubmit = async () => {
    setLoading(true)
    const res = await updateLenguage({ id: globalData.worker._id, token: globalData.token, lenguage: currentData.currentLenguage === 'Español' ? 'es' : 'ca' })
    if (res.status === 200) {
      updateData({ worker: globalData.worker, token: globalData.token, center: currentData.currentCenter, lenguage: currentData.currentLenguage === 'Español' ? 'es' : 'ca', role: currentData.currentRole })
      leng = getLenguage(currentData.currentLenguage === 'Español' ? 'es' : 'ca', 'settings')
      setMessage(leng.cambios_exito)
      setCorrect(true)
      setLoading(false)
    } else {
      setMessage(leng.cambios_error)
      setCorrect(false)
      setLoading(false)
    }
  }

  return (
      <div className='settings'>
        <h1>{leng.settings}</h1>
        <h3>{leng.informacionCuenta}</h3>
        <div className="info_container">
        <div className="info_container_item">
          <p className='info_title'>{leng.nombre}:</p>
          <p className='info_value'>{globalData.worker.nombre}</p>
        </div>
        <div className="info_container_item">
          <p className='info_title'>DNI:</p>
          <p className='info_value'>{globalData.worker.dni}</p>
        </div>
        <div className="info_container_item">
          <p className='info_title'>{leng.numColegiado}:</p>
          <p className='info_value'>{globalData.worker.numColegiado}</p>
        </div>
        <div className="info_container_item">
          <p className='info_title'>{leng.usuario}:</p>
          <p className='info_value'>{globalData.worker.username}</p>
        </div>
        <div className="info_container_item">
          <p className='info_title'>{leng.correo}:</p>
          <p className='info_value'>{globalData.worker.correo}</p>
        </div>
        <div className="info_container_item">
          <p className='info_title'>{leng.telefono}:</p>
          <p className='info_value'>{globalData.worker.telefono}</p>
        </div>
        </div>
        <h3>{leng.ajustes_perfil}</h3>
          <p>{leng.cambia_datos}</p>
          <div className="settings_container">
            <div className="settings_container_item">
              <h5>{leng.cambia_centro}</h5>
              <Select currentSelect={currentData.currentCenter} handleChange={(option) => { handleChange({ name: 'center', option }) }}>
                {
                  currentData.optionsCenter.map((option, index) => {
                    return <Option key={index} option={option}>{option}</Option>
                  })
                }
              </Select>
            </div>
            <div className="settings_container_item">
              <h5>{leng.cambia_espe}</h5>
              <Select currentSelect={currentData.currentRole} handleChange={(option) => { handleChange({ name: 'role', option }) }}>
                {
                  currentData.optionsRole.map((option, index) => {
                    return <Option key={index} option={option}>{option}</Option>
                  })
                }
              </Select>
            </div>
            <div className="settings_container_item">
              <h5>{leng.cambia_leng}</h5>
              <Select currentSelect={currentData.currentLenguage} handleChange={(option) => { handleChange({ name: 'lenguage', option }) }}>
                {
                  currentData.optionsLenguage.map((option, index) => {
                    return <Option key={index} option={option}>{option}</Option>
                  })
                }
              </Select>
            </div>
            <div className="settings_submit">
                { loading
                  ? <div className="loading">
                    <p>Esta cargando</p>
                    </div>
                  : null}
                { correct && message
                  ? <div className="correct">
                    <p className='correct_message'>{message}</p>
                  </div>
                  : null}
                { !correct && message
                  ? <div className="error">
                    <p className='error_message'>{message}</p>
                  </div>
                  : null}
              <button className='settings_submit_button' onClick={handleSubmit}><p className='settings_submit_button_message'>{leng.aplicar}</p></button>
            </div>
          </div>
          <button className='logout' onClick={handleLogout}><p className='logout_message'>{leng.cerrar_sesion}</p></button>
      </div>
  )
}

export default ProfileSettings
