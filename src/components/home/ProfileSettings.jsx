import {React }from 'react'
import Selector from './Selector'

const ProfileSettings = () => {

  const opciones = ["opcion 1", "opcion 2", "opcion 3", "opcion 4", "opcion 4","opcion 4","opcion 4","opcion 4","opcion 4","opcion 4","opcion 4",]

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
        
      </div>
  )
}

export default ProfileSettings