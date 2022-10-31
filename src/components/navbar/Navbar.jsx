import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear, faHouseChimney } from '@fortawesome/free-solid-svg-icons'
import { useGlobalContext } from '../../hooks/useGlobalContext'

const Navbar = () => {
  const { globalData } = useGlobalContext()
  return (
      <div id="navbar" className='navbar'>
        <div className="navbar_container">
        <a href='/home'><FontAwesomeIcon icon={faHouseChimney} className='button'/></a>
          <span className="navbar_container_items">
            <p className='navbar_container_item'>{globalData.worker.nombre}</p>
            <p className='navbar_container_item'> - </p>
            <p className='navbar_container_item'>{globalData.role}</p>
            <a href='/settings' className='settings_button'><FontAwesomeIcon icon={faGear} className='button'/></a>
          </span>
        </div>
      </div>
  )
}

export default Navbar
