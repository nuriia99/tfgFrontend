import { React, useEffect, useState } from 'react'
import useFetch from '../../hooks/useFetch'
import { useGlobalContext } from '../../hooks/useGlobalContext'
import { getLenguage } from '../../utils/lenguage'

const SearchForm = ({ handleSearch, type }) => {
  const { globalData } = useGlobalContext()
  const leng = getLenguage(globalData.lenguage, 'home')

  const [name, setName] = useState('')
  const [firstSurname, setFirstSurname] = useState('')
  const [secondSurname, setSecondSurname] = useState('')
  const [sex, setSex] = useState('M')
  const [dni, setDni] = useState('')
  const [cip, setCip] = useState('')

  const { fetchData: fetchDataSearch, data: dataSearch } = useFetch()
  const [initialRender, setInitialRender] = useState(true)

  useEffect(() => {
    const searchData = async () => {
      let url = `/patients/?${name ? 'nombre=' + name : ''}${name ? '&&' : ''}${firstSurname ? 'apellido1=' + firstSurname : ''}${firstSurname ? '&&' : ''}${secondSurname ? 'apellido2=' + secondSurname : ''}${secondSurname ? '&&' : ''}${sex ? 'sexo=' + sex : ''}${sex ? '&&' : ''}${dni ? 'dni=' + dni : ''}${dni ? '&&' : ''}${cip ? 'cip=' + cip : ''}${cip ? '&&' : ''}`
      url = url.substring(0, url.length - 2)
      await fetchDataSearch(url)
    }
    if (!initialRender) {
      searchData()
    }
    setInitialRender(false)
  }, [name, firstSurname, secondSurname, sex, dni, cip])

  useEffect(() => {
    handleSearch(dataSearch)
  }, [dataSearch])

  return (
    <>
    {
      type !== 'appointment'
        ? <>
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
      </div>
      </>
        : <>
        <div className="search_container">
          <div className="search_container_name">
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
          </div>
          <div className="search_container_name">
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
            </div>
          </div>
        </>
    }
    </>
  )
}

export default SearchForm
