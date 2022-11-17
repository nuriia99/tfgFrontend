import { React, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHospitalUser, faAnglesDown } from '@fortawesome/free-solid-svg-icons'
import { getLenguage } from '../../../utils/lenguage'
import { useGlobalContext } from '../../../hooks/useGlobalContext'
import PatientInfoItem from './PatientInfoItem'
import { usePatientContext } from '../../../hooks/usePatientContext'
import { getDate, getName } from '../../../utils/utils'

const PatientInfo = ({ handleClickPrincipalComponent }) => {
  const { globalData } = useGlobalContext()
  const { patientData } = usePatientContext()
  const info = patientData.patient
  const leng = getLenguage(globalData.lenguage, 'patient')
  const [active, setActive] = useState('inactive')
  const handleClick = () => {
    if (active === 'inactive') return setActive('active')
    return setActive('inactive')
  }

  return (
    info
      ? <div className="patient_info">
          <p name='entries' onClick={handleClickPrincipalComponent} className='patient_info_name'><FontAwesomeIcon className='icon' icon={faHospitalUser}/>{getName(info.nombre, info.apellido1, info.apellido2)}</p>
          <div className='patient_info_line'>
            <p className='title'>{leng.edad}: {info.edad} {leng.años} - {leng.sexo}: {info.sexo} - {leng.genero}: {info.genero}</p>
            <button className={'patient_info_line_button ' + active} onClick={handleClick}><FontAwesomeIcon className='icon' icon={faAnglesDown}/></button>
          </div>
          <div className={'patient_info_extra ' + active}>
            <PatientInfoItem title='CIP: ' value={info.cip}/>
            <PatientInfoItem title='dni: ' value={info.dni}/>
            <PatientInfoItem title={leng.nacimiento} value={getDate(info.fechaNacimiento)}/>
            <PatientInfoItem title={leng.telefono} value={info.telefono}/>
            <PatientInfoItem title={leng.correo} value={info.correo}/>
            <PatientInfoItem title={leng.pais} value={info.paisOrigen}/>
            <PatientInfoItem title={leng.direccion} value={info.direccion}/>
          </div>
        </div>
      : null
  )
}

export default PatientInfo
