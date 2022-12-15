import { React, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartLine, faGear, faHouseChimney } from '@fortawesome/free-solid-svg-icons'
import { useGlobalContext } from '../../hooks/useGlobalContext'
import { getLenguage } from '../../utils/lenguage'

const Navbar = () => {
  const { globalData } = useGlobalContext()
  const leng = getLenguage(globalData.lenguage, 'statistics')
  const [select, setSelect] = useState('')
  return (
      <div id="navbar" className='navbar'>
        <div className="navbar_container">
          <div className="navbar_container_links">
            <a href='/app/home'><FontAwesomeIcon icon={faHouseChimney} className='button'/></a>
            <div className="goals">
              <a href='/app/goals' className='goals_button'><FontAwesomeIcon icon={faChartLine} className='button_chart'/><p>{leng.estadisticas}</p></a>
              <ul className='drowdown'>
                <a href="/app/goals" onMouseOver={() => setSelect('objetivos')}><li className={ select === 'objetivos' ? 'active' : 'inactive'}>{leng.objetivos}</li></a>
                <a href="/app/lists" onMouseOver={() => setSelect('listados')}><li className={ select === 'listados' ? 'active' : 'inactive'}>{leng.listados}</li></a>
              </ul>
            </div>
          </div>
          <span className="navbar_container_items">
            <p className='navbar_container_item'>{globalData.worker.nombre}</p>
            <p className='navbar_container_item'> - </p>
            <p className='navbar_container_item'>{globalData.role}</p>
            <p className='navbar_container_item'> - </p>
            <p className='navbar_container_item'>{globalData.worker.numColegiado}</p>
            <p className='navbar_container_item'> - </p>
            <p className='navbar_container_item'>{globalData.center}</p>
            <a href='/app/settings' className='settings_button'><FontAwesomeIcon icon={faGear} className='button'/></a>
          </span>
        </div>
      </div>
  )
}

export default Navbar
