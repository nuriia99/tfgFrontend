import { React, useState, useEffect } from 'react'
import useFetch from '../../../hooks/useFetch'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'

const Search = ({ type, submit }) => {
  const [name, setName] = useState('')
  const { fetchData, data } = useFetch()
  const [rowSelected, setRowSelected] = useState()

  useEffect(() => {
    if (type === 'med') fetchData('/prescriptions/searchMed/?name=' + name)
    else fetchData('/prescriptions/searchDiagnosis/?name=' + name)
  }, [name])

  const handleClick = (index) => {
    setRowSelected(index)
  }

  return (
    <>
      <div className="search_component">
        <div className="search_component_container">
          <div className="search_component_container_info">
            <input placeholder={type === 'med' ? 'Escriba el nombre del medicamento' : 'Escriba el nombre del diagnostico'} type="text" value={name} name="inputName" onChange={({ target }) => setName(target.value)} required="required"/>
            <div className="row_header">
              { type === 'med' ? <p>Nombre del medicamento</p> : <p>Nombre del diagnostico</p> }
            </div>
            <div className="rows crossbar">
              {
                data
                  ? <>
                    {
                      data.map((med, index) => {
                        return (
                          <div onClick={() => { handleClick(index) }} key={index} className={rowSelected === index ? 'row active' : 'row'}>{med.nombre}</div>
                        )
                      })
                    }
                  </>
                  : null
              }
            </div>
            <button onClick={() => { submit(data[rowSelected]) }} className='button_classic'>Escoger</button>
          </div>
          <div className="exit">
            <button onClick={submit} className='button_classic'><FontAwesomeIcon className='icon' icon={faArrowRightFromBracket}/></button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Search
