import { React, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useGlobalContext } from '../../hooks/useGlobalContext'
import { getLenguage } from '../../utils/lenguage'
import Search from '../patient/patientInfo/Search'
import 'react-datez/dist/css/react-datez.css'
import { ReactDatez } from 'react-datez'

const ListsContainer = () => {
  const { globalData } = useGlobalContext()
  const leng = getLenguage(globalData.lenguage, 'statistics')
  const [diagnosis, setDiagnosis] = useState([])
  const [meds, setMeds] = useState([])
  const [searchD, setSearchD] = useState()
  const [searchM, setSearchM] = useState()
  const currentDay = new Date()
  const weekBefore = currentDay.setDate(currentDay.getDate() - 7)
  const [parameters, setParameters] = useState({
    minAge: 18,
    maxAge: 90,
    sex: 'M',
    p1: 18 / 130 * 100,
    p2: 90 / 130 * 100,
    startDate: weekBefore,
    endDate: new Date()
  })

  const submitDiagnosis = (diagnosis) => {
    if (diagnosis !== '') setDiagnosis(prev => [...prev, { diagnosis, statusDiagnosis: 'active' }])
    setSearchD(false)
  }
  const submitMeds = (med) => {
    if (med !== '') setMeds(prev => [...prev, { med, statusMed: 'active' }])
    setSearchM(false)
  }
  const changeDiagnosis = (index, change) => {
    console.log(index, change)
    setDiagnosis(prev => {
      const arr = [...prev]
      const diagnosis = arr[index].diagnosis
      arr[index] = { diagnosis, statusDiagnosis: change }
      return arr
    })
  }
  const deleteDiagnosis = (index) => {
    setDiagnosis(prev => {
      const arr = [...prev]
      arr.splice(index, 1)
      return arr
    })
  }
  const changeMed = (index, change) => {
    setMeds(prev => {
      const arr = [...prev]
      const med = arr[index].med
      arr[index] = { med, statusMed: change }
      return arr
    })
  }
  const deleteMed = (index) => {
    setMeds(prev => {
      const arr = [...prev]
      arr.splice(index, 1)
      return arr
    })
  }
  const changeParameters = (value, type) => {
    setParameters(prev => {
      if (type === 'minAge') {
        if (parseInt(value) < prev.maxAge) return { ...prev, minAge: value, p1: parseInt(value) / 130 * 100 }
      } else if (type === 'maxAge') {
        if (parseInt(value) > prev.minAge) return { ...prev, maxAge: value, p2: parseInt(value) / 130 * 100 }
        return prev
      } else if (type === 'sex') return { ...prev, sex: value }
      else if (type === 'fechaInicio') return { ...prev, fechaInicio: new Date(value) }
      else if (type === 'fechaFinal') return { ...prev, fechaFinal: new Date(value) }
      return prev
    })
  }
  console.log(parameters)
  return (
    <>
      <div className="lists">
        {searchD ? <Search type='diagnosis' submit={submitDiagnosis}/> : null}
        {searchM ? <Search type='med' submit={submitMeds}/> : null}
        <div className="lists_container">
          <div className="lists_container_form">
            <span className='title'>{leng.parametros}</span>
            <label>{leng.diagnostico}</label>
            {
              diagnosis.map((d, index) => {
                return (
                  <div key={index} className="lists_container_form_diagnosis">
                    <div className="search">
                      <div className="diagnosis">{d.diagnosis.nombre}</div>
                      <button type='button' onClick={() => { deleteDiagnosis(index) }} className='search_button'><FontAwesomeIcon icon={faTrash}/></button>
                    </div>
                    <div className="state">
                      <label>{leng.estado}</label>
                      <input type="radio" checked={d.statusDiagnosis === 'active'} value={leng.activo} name={'inputDiagnosisActive' + index} onChange={() => changeDiagnosis(index, 'active')} required="required"/>
                      <label>{leng.activo}</label>
                      <input type="radio" checked={d.statusDiagnosis === 'inactive'} value={leng.inactivo} name={'inputDiagnosisInactive' + index} onChange={() => changeDiagnosis(index, 'inactive')} required="required"/>
                      <label>{leng.inactivo}</label>
                      <input type="radio" checked={d.statusDiagnosis === 'B'} value={leng.inactivo} name={'inputDiagnosisBoth' + index} onChange={(e) => changeDiagnosis(index, 'B')} required="required"/>
                      <label>{leng.todos}</label>
                    </div>
                  </div>
                )
              })
            }
            <div className="search">
              <div className="diagnosis"></div>
              <button type='button' onClick={() => { setSearchD(true) }} className='search_button'><FontAwesomeIcon icon={faMagnifyingGlass}/></button>
            </div>
            <label>{leng.medicamento}</label>
            {
              meds.map((d, index) => {
                return (
                  <div key={index} className="lists_container_form_diagnosis">
                    <div className="search">
                      <div className="diagnosis">{d.med.nombre}</div>
                      <button type='button' onClick={() => { deleteMed(index) }} className='search_button'><FontAwesomeIcon icon={faTrash}/></button>
                    </div>
                    <div className="state">
                      <label>{leng.estado}</label>
                      <input type="radio" checked={d.statusMed === 'active'} value={leng.activo} name={'inputMedActive' + index} onChange={() => changeMed(index, 'active')} required="required"/>
                      <label>{leng.activo}</label>
                      <input type="radio" checked={d.statusMed === 'inactive'} value={leng.inactivo} name={'inputMedInactive' + index} onChange={() => changeMed(index, 'inactive')} required="required"/>
                      <label>{leng.inactivo}</label>
                      <input type="radio" checked={d.statusMed === 'B'} value={leng.inactivo} name={'inputMedBoth' + index} onChange={(e) => changeMed(index, 'B')} required="required"/>
                      <label>{leng.todos}</label>
                    </div>
                  </div>
                )
              })
            }
            <div className="search">
              <div className="meds"></div>
              <button type='button' onClick={() => { setSearchM(true) }} className='search_button'><FontAwesomeIcon icon={faMagnifyingGlass}/></button>
            </div>
            <div className="lists_container_form_info">
              <div className="lists_container_form_info_age">
                <div className="values">
                  <label>{leng.age}</label>
                  <span id='range1'>Min: {parameters.minAge}</span>
                  <span> - </span>
                  <span id='range2'>Max: {parameters.maxAge}</span>
                </div>
                <div className="wrapper">
                  <div className="wrapper_container">
                    <div className="slider-track" style={{ background: `linear-gradient(to right, #d5d5d5 ${parameters.p1}%, #0979b0 ${parameters.p1}% ${parameters.p2}%, #d5d5d5 ${parameters.p2}%` }}></div>
                    <input type='range' min='0' max='130' value={parameters.minAge} id='slider-1' onChange={(e) => changeParameters(e.target.value, 'minAge')}></input>
                    <input type='range' min='0' max='130' value={parameters.maxAge} id='slider-2' onChange={(e) => changeParameters(e.target.value, 'maxAge')}></input>
                  </div>
                </div>
              </div>
              <div className="lists_container_form_info_sex">
                <div className="state">
                  <label>{leng.sexo}</label>
                  <input type="radio" checked={parameters.sex === 'M'} value={leng.activo} name='inputM' onChange={(e) => changeParameters('M', 'sex')} required="required"/>
                  <label>{leng.masc}</label>
                  <input type="radio" checked={parameters.sex === 'F'} value={leng.inactivo} name='inputF' onChange={(e) => changeParameters('F', 'sex')} required="required"/>
                  <label>{leng.fem}</label>
                  <input type="radio" checked={parameters.sex === 'B'} value={leng.inactivo} name='inputB' onChange={(e) => changeParameters('B', 'sex')} required="required"/>
                  <label>{leng.todos}</label>
                </div>
              </div>
            </div>
            <div className="lists_container_form_dates">
              <div className="lists_container_form_dates_start">
                <label>{leng.fechaInicio}</label>
                <ReactDatez className='datePicker' allowPast={true} allowFuture={false} locale='es' value={parameters.fechaInicio} handleChange={(e) => changeParameters(e, 'fechaInicio')}/>
              </div>
              <div className="lists_container_form_dates_end">
                <label>{leng.fechaFinal}</label>
                <ReactDatez allowPast={true} allowFuture={false} locale='es' value={parameters.fechaFinal} handleChange={(e) => changeParameters(e, 'fechaFinal')}/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FontAwesomeIcon icon={faTrash}/>
    </>
  )
}

export default ListsContainer
