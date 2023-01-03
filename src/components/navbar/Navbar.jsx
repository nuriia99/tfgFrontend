import { React, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartLine, faGear, faHouseChimney } from '@fortawesome/free-solid-svg-icons'
import { useGlobalContext } from '../../hooks/useGlobalContext'
import { getLenguage } from '../../utils/lenguage'

const Navbar = () => {
  const { globalData } = useGlobalContext()
  const leng = getLenguage(globalData.lenguage, 'statistics')
  const [select, setSelect] = useState('')
  const [open, setOpen] = useState('')

  visualViewport.onresize = () => {
    if (visualViewport.width > 1023) {
      setOpen('')
    }
  }
  const handleOpen = () => {
    setOpen(prev => {
      if (prev === '') return 'open fade-in'
      else if (prev === 'open fade-in') return 'close fade-out'
      else if (prev === 'close fade-out') return 'open fade-in'
    })
  }

  return (
      <div id="navbar" className='navbar'>
        <div className="navbar_container">
          <div className={ open === 'open fade-in' ? 'navbar_mobile hide-for-desktop open' : 'navbar_mobile hide-for-desktop'}>
            <a href='/app/home'><FontAwesomeIcon icon={faHouseChimney} className='button'/></a>
            <a onClick={handleOpen} id="btn-ham" className='header-toggle'>
              <span></span>
              <span></span>
              <span></span>
            </a>
            <div className={'overlay2 ' + open}>
              <div className="overlay2_box">
                <div className="overlay2_box_item">
                  <a href='/app/settings' className='settings_button'>{leng.configuracion}</a>
                </div>
                <div className="overlay2_box_item">
                  <a href="/app/goals" onMouseOver={() => setSelect('objetivos')}>{leng.objetivos}</a>
                </div>
                <div className="overlay2_box_item">
                  <a href="/app/lists" onMouseOver={() => setSelect('listados')}>{leng.listados}</a>
                </div>
              </div>
            </div>
          </div>
          <div className="navbar_container_links hide-for-mobile">
            <a href='/app/home'><FontAwesomeIcon icon={faHouseChimney} className='button'/></a>
            <div className="goals">
              <a href='/app/goals' className='goals_button'><FontAwesomeIcon icon={faChartLine} className='button_chart'/><p>{leng.estadisticas}</p></a>
              <ul className='drowdown'>
                <a href="/app/goals" onMouseOver={() => setSelect('objetivos')}><li className={ select === 'objetivos' ? 'active' : 'inactive'}>{leng.objetivos}</li></a>
                <a href="/app/lists" onMouseOver={() => setSelect('listados')}><li className={ select === 'listados' ? 'active' : 'inactive'}>{leng.listados}</li></a>
              </ul>
            </div>
          </div>
          <span className="navbar_container_items hide-for-mobile">
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
