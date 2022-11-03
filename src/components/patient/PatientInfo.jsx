import { React, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHospitalUser, faAnglesDown } from '@fortawesome/free-solid-svg-icons'
import { getLenguage } from '../../services/lenguage'
import { useGlobalContext } from '../../hooks/useGlobalContext'
import PatientInfoItem from './PatientInfoItem'
const PatientInfo = ({ info }) => {
  const { globalData } = useGlobalContext()
  const leng = getLenguage(globalData.lenguage, 'patient')
  const [active, setActive] = useState('inactive')
  const handleClick = () => {
    if (active === 'inactive') return setActive('active')
    return setActive('inactive')
  }
  return (
      <div className="patient_info">
        <p className='patient_info_name'><FontAwesomeIcon className='icon' icon={faHospitalUser}/>{info.name}</p>
        <div className='patient_info_line'>
          <p className='title'>{leng.edad}: {info.age} {leng.años} - {leng.sexo}: {info.sex} - {leng.genero}: {info.genre}</p>
          <button className={'patient_info_line_button ' + active} onClick={handleClick}><FontAwesomeIcon className='icon' icon={faAnglesDown}/></button>
        </div>
        <div className={'patient_info_extra ' + active}>
          <PatientInfoItem title='CIP: ' value={info.cip}/>
          <PatientInfoItem title='dni: ' value={info.dni}/>
          <PatientInfoItem title={leng.nacimiento} value={info.bornDate}/>
          <PatientInfoItem title={leng.telefono} value={info.telephone}/>
          <PatientInfoItem title={leng.correo} value={info.mail}/>
          <PatientInfoItem title={leng.pais} value={info.country}/>
          <PatientInfoItem title={leng.direccion} value={info.address}/>
        </div>
      </div>
  )
}

export default PatientInfo
