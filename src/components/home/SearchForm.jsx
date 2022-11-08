import { React, useState } from 'react'
import { useGlobalContext } from '../../hooks/useGlobalContext'
import { getLenguage } from '../../services/lenguage'
import { getSearchPatient } from '../../services/patient'

const SearchForm = ({ handleSearch }) => {
  const { globalData } = useGlobalContext()
  const leng = getLenguage(globalData.lenguage, 'home')

  const [name, setName] = useState('')
  const [firstSurname, setFirstSurname] = useState('')
  const [secondSurname, setSecondSurname] = useState('')
  const [sex, setSex] = useState('M')
  const [dni, setDni] = useState('')
  const [cip, setCip] = useState('')

  const handleClick = async (e) => {
    e.preventDefault()
    const res = await getSearchPatient({ name, firstSurname, secondSurname, sex, dni, cip, token: globalData.token })
    handleSearch(res.data)
  }

  return (
    <>
    <span className="home_container_left_search_title">{leng.busqueda}</span>
      <div className="search_container">
        <div className="search_container_item">
          <label>{leng.nombre}:</label>
          <input type="text" value={name} name="inputName" onChange={({ target }) => setName(target.value)} required="required"/>
        </div>
        <div className="search_container_item">
          <label>{leng.apellido1}:</label>
          <input type="text" value={firstSurname} name="inputSurname1" onChange={({ target }) => setFirstSurname(target.value)} required="required"/>
        </div>
        <div className="search_container_item">
          <label>{leng.apellido2}:</label>
          <input type="text" value={secondSurname} name="inputSurname2" onChange={({ target }) => setSecondSurname(target.value)} required="required"/>
        </div>
        <div className="search_container_item">
          <label>{leng.sexo}:</label>
          <div className="search_container_item_radio">
            <input type="radio" checked={sex === 'M'} value={leng.hombre} name="inputMasc" onChange={() => setSex('M')} required="required"/>
            <label>{leng.hombre}</label>
            <input type="radio" checked={sex === 'F'} value={leng.mujer} name="inputFem" onChange={() => setSex('F')} required="required"/>
            <label>{leng.mujer}</label>
          </div>
        </div>
        <div className="search_container_item">
          <label>DNI:</label>
          <input type="text" value={dni} name="inputDNI" onChange={({ target }) => setDni(target.value)} required="required"/>
        </div>
        <div className="search_container_item">
          <label>CIP:</label>
          <input type="text" value={cip} name="inputCIP" onChange={({ target }) => setCip(target.value)} required="required"/>
        </div>
        <div className="search_container_button">
          <button onClick={handleClick} id='button_submit_search' className='button_classic'>{leng.buscar}</button>
        </div>
      </div>
    </>
  )
}

export default SearchForm