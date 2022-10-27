import {React, useState }from 'react'
import Selector from './Selector'
import { useGlobalContext } from '../../hooks/useGlobalContext'
import {usePost} from '../../hooks/usePost'


const ProfileSettings = () => {

  const lenguages = ["Español", "Catalán"]
  const {globalData, updateData, reset} = useGlobalContext()

  const [currentData, setCurrentData] = useState({
    currentCenter: globalData.center,
    optionsCenter: globalData.worker.centros.filter((item) => item !== globalData.worker.turno.centro),
    currentRole: globalData.role,
    optionsRole: globalData.worker.especialidades.filter((item) => item !== globalData.worker.turno.rol),
    currentLenguage: globalData.lenguage,
    optionsLenguage: lenguages.filter((item) => item !== globalData.worker.lenguaje)
  })

  

  const handleLogout = () => {
      reset()
  }

  const handleChange = (info) => {
    setCurrentData((prev) => {
      const currentValue = info.value
      if (info.name === 'center') {
        const options = globalData.worker.centros.filter((item) => item !== currentValue)
        return {...prev, currentCenter: currentValue, optionsCenter: options}
      } else if (info.name === 'role') {
        const options = globalData.worker.especialidades.filter((item) => item !== currentValue)
        return {...prev, currentRole: currentValue, optionsRole: options}
      } else {
        const options = lenguages.filter((item) => item !== currentValue)
        return {...prev, currentLenguage: currentValue, optionsLenguage: options}
      }
    })
  }
  const handleSubmit = () => {
    //const {error} = usePost()
    updateData({ worker:globalData.worker, token: globalData.token, center: currentData.currentCenter, lenguage: currentData.currentLenguage, role: currentData.currentRole })
  }


  return (
      <div className='settings'>
        <h1>Configuración</h1>
        <h3>Ajustes de perfil</h3>
          <p>Cambia los datos relacionados a tu cuenta.</p>
          <div className="settings_container">
            <div className="settings_container_item">
              <h5>Cambiar el centro</h5>
              <Selector name='center' currentSelect={currentData.currentCenter} options={currentData.optionsCenter} handleChange={handleChange}/>
            </div>
            <div className="settings_container_item">
              <h5>Cambiar de especialidad</h5>
              <Selector name='role' currentSelect={currentData.currentRole} options={currentData.optionsRole} handleChange={handleChange}/>
            </div>
            <div className="settings_container_item">
              <h5>Cambiar el lenguaje</h5>
              <Selector name='lenguage' currentSelect={currentData.currentLenguage} options={currentData.optionsLenguage} handleChange={handleChange}/>
            </div>
            <div className="settings_submit">
              <button className='settings_submit_button' onClick={handleSubmit}><p className='settings_submit_button_message'>Aplicar cambios</p></button>
            </div>
            
          </div>
          <button className='logout' onClick={handleLogout}><p className='logout_message'>Cerrar sesión</p></button>
        
      </div>
  )
}

export default ProfileSettings