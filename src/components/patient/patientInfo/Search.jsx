import { React, useState, useEffect } from 'react'
import useFetch from '../../../hooks/useFetch'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { getLenguage } from '../../../utils/lenguage'
import { useGlobalContext } from '../../../hooks/useGlobalContext'

const Search = ({ type, submit }) => {
  const { globalData } = useGlobalContext()
  const leng = getLenguage(globalData.lenguage, 'patient')
  const [name, setName] = useState('')
  const { fetchData, data } = useFetch()
  const [rowSelected, setRowSelected] = useState()

  useEffect(() => {
    if (type === 'med') {
      fetchData('/prescriptions/searchMed/?name=' + name, { role: globalData.role })
    } else fetchData('/prescriptions/searchDiagnosis/?name=' + name)
  }, [name])

  const handleClick = (index) => {
    setRowSelected(index)
  }

  return (
    <>
      <div className="search_component">
        <div className="search_component_container">
          <div className="search_component_container_info">
            <input placeholder={type === 'med' ? leng.searchMessageMed : leng.searchMessageDiagnosis } type="text" value={name} name="inputName" onChange={({ target }) => setName(target.value)} required="required" autoComplete='false'/>
            <div className="row_header">
              { type === 'med' ? <p>{leng.medName}</p> : <p>{leng.diagnosisName}</p> }
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
            <button onClick={() => { submit(data[rowSelected]) }} className='button_classic'>{leng.escoger}</button>
          </div>
          <div className="exit">
            <button onClick={() => { submit('') }} className='button_classic'><FontAwesomeIcon className='icon' icon={faArrowRightFromBracket}/></button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Search
