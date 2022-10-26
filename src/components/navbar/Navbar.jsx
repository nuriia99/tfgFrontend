import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear } from '@fortawesome/free-solid-svg-icons'
import { useGlobalContext } from '../../hooks/useGlobalContext'

const Navbar = () => {

  const {globalData} = useGlobalContext()
  const { worker } = globalData
  const name = worker.nombre + ' ' + worker.apellido1 + ' ' + worker.apellido2
  const turn = worker.turnos.filter((t) => {
    const currentDate = new Date()
    const begin = new Date(t.horaInicio)
    const end = new Date(t.horaFinal)
    return  begin < currentDate && currentDate < end
  })
  

  return (
      <div className='navbar'>
        <div className="navbar_container">
          <span className="navbar_container_items">
            <p className='navbar_container_item'>{name}</p>
            <p className='navbar_container_item'> - </p>
            <p className='navbar_container_item'>Medicina general</p>
          </span>
          <a href='./settings'><FontAwesomeIcon icon={faGear} className='buttonSettings'/></a>
        </div>
      </div>
  )
}

export default Navbar