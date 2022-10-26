import {React }from 'react'
import Selector from './Selector'
import { useGlobalContext } from '../../hooks/useGlobalContext'

const ProfileSettings = () => {

  const opciones = ["opcion 1", "opcion 2", "opcion 3", "opcion 4", "opcion 4","opcion 4","opcion 4","opcion 4","opcion 4","opcion 4","opcion 4",]
  const {reset} = useGlobalContext()

  const handleLogout = () => {
      reset()
  }

  return (
      <div className='settings'>
        <h1>Configuración</h1>
        <h3>Ajustes de perfil</h3>
          <p>Cambia los datos relacionados a tu cuenta.</p>
          <div className="settings_container">
            <div className="settings_container_item">
              <h5>Cambiar el centro</h5>
              <Selector  currentSelect="Opcion 1" options={opciones}/>
            </div>
            <div className="settings_container_item">
              <h5>Cambiar de especialidad</h5>
              <Selector  currentSelect="Opcion 1" options={opciones}/>
            </div>
            <div className="settings_container_item">
              <h5>Cambiar el lenguaje</h5>
              <Selector  currentSelect="Opcion 1" options={opciones}/>
            </div>
            
          </div>
          <button className='logout' onClick={handleLogout}><p className='logout_message'>Cerrar sesión</p></button>
        
      </div>
  )
}

export default ProfileSettings