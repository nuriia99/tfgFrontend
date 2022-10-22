import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'

const Navbar = () => {
  return (
      <div className='navbar'>
        <div className="navbar_container">
          <span className="navbar_container_items">
            <p className='navbar_container_item'>Marco Carreño Millan</p>
            <p className='navbar_container_item'> - </p>
            <p className='navbar_container_item'>Medicina general</p>
          </span>
          <a href='./settings'><FontAwesomeIcon icon={faGear} className='buttonSettings'/></a>
        </div>
      </div>
  )
}

export default Navbar