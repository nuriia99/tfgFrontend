import { React, useState, useEffect } from 'react'
import { useGlobalContext } from '../../hooks/useGlobalContext'
import { getLenguage } from '../../services/lenguage'
import { Select, Option } from './Select'
import usePost from '../../hooks/usePost'

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

  const { postData: postLenguage, data: dataLenguage, loading, error } = usePost()

  useEffect(() => {
    if (dataLenguage) {
      if (dataLenguage.status === 200) {
        updateData({ worker: globalData.worker, token: globalData.token, center: currentData.currentCenter, lenguage: currentData.currentLenguage === 'Español' ? 'es' : 'ca', role: currentData.currentRole })
        leng = getLenguage(currentData.currentLenguage === 'Español' ? 'es' : 'ca', 'settings')
      }
    }
  }, [dataLenguage])

  const handleSubmit = async () => {
    postLenguage('/trabajadores/' + globalData.worker._id + '/updateLenguage', currentData.currentLenguage === 'Español' ? 'es' : 'ca')
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
                { !error && dataLenguage
                  ? <div className="correct">
                    <p className='correct_message'>{leng.cambios_exito}</p>
                  </div>
                  : null}
                { error
                  ? <div className="error">
                    <p className='error_message'>{leng.cambios_error}</p>
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
