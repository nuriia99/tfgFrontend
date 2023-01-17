import { React, useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDownShortWide, faArrowDownWideShort, faFileExcel, faFilePdf, faMagnifyingGlass, faTrash } from '@fortawesome/free-solid-svg-icons'
import { useGlobalContext } from '../../hooks/useGlobalContext'
import { getLenguage } from '../../utils/lenguage'
import Search from '../patient/patientInfo/Search'
import DatePicker from 'react-date-picker'
import { Select, Option } from '../home/Select'
import usePost from '../../hooks/usePost'
import { getName } from '../../utils/utils'
import * as XLSX from 'xlsx/xlsx.mjs'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const ListsContainer = () => {
  const { globalData } = useGlobalContext()
  const leng = getLenguage(globalData.lenguage, 'statistics')
  const [diagnosis, setDiagnosis] = useState([])
  const [meds, setMeds] = useState([])
  const [searchD, setSearchD] = useState()
  const [searchM, setSearchM] = useState()
  const weekBefore = new Date()
  weekBefore.setDate(weekBefore.getDate() - 30)
  const [parameters, setParameters] = useState({
    minAge: 18,
    maxAge: 90,
    sex: 'B',
    p1: 18 / 130 * 100,
    p2: 90 / 130 * 100,
    startDate: weekBefore,
    endDate: new Date(),
    currentSelect: 'Todos los pacientes'
  })
  const AI = ['tabaquismo', 'drogas', 'alcohol', 'actividadFisica', 'valoracionPacientesCronicos', 'frecuenciaCardiaca', 'peso', 'estatura', 'colesterolTotal', 'tensionArterial', 'glucemiaCapilar', 'saturacionOxigeno']

  const submitDiagnosis = (diagnosis) => {
    if (diagnosis !== '') setDiagnosis(prev => [...prev, { diagnosis, statusDiagnosis: 'active' }])
    setSearchD(false)
  }
  const submitMeds = (med) => {
    if (med !== '') setMeds(prev => [...prev, { med, statusMed: 'active' }])
    setSearchM(false)
  }
  const changeDiagnosis = (index, change) => {
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
      else if (type === 'fechaInicio') return { ...prev, startDate: new Date(value) }
      else if (type === 'fechaFinal') {
        const newEndDate = new Date(value)
        newEndDate.setDate(newEndDate.getDate() + 1)
        return { ...prev, endDate: newEndDate }
      } else if (type === 'selector') return { ...prev, currentSelect: value }
      return prev
    })
  }

  const { postData: fetchDataSearch, data: dataSearch } = usePost()
  const [dataPatients, setDataPatients] = useState()

  const handleClick = async (e) => {
    e.preventDefault()
    await fetchDataSearch('/goals/getPatientsLists', { parameters, diagnosis, meds, centros: globalData.worker.centrosInfo })
  }

  const [result, setResult] = useState({
    numMujeres: 0,
    numHombres: 0,
    columnasHeader: ['CIP', leng.nombre, leng.edad2, leng.sexo2],
    columnasValue: ['cip', 'nombre', 'edad', 'sexo'],
    numFixed: 3
  })

  useEffect(() => {
    if (dataSearch) {
      const newData = [...dataSearch.data]
      setResult(prev => { return { ...prev, numHombres: 0, numMujeres: 0 } })
      if (parameters.sex === 'M') setResult(prev => { return { ...prev, numHombres: newData.length } })
      else if (parameters.sex === 'F') setResult(prev => { return { ...prev, numMujeres: newData.length } })
      else {
        newData.forEach(patient => {
          if (patient.sexo === 'M') setResult(prev => { return { ...prev, numHombres: prev.numHombres + 1 } })
          else setResult(prev => { return { ...prev, numMujeres: prev.numMujeres + 1 } })
        })
      }
      const newVector = []
      result.columnasValue.forEach((v, index2) => {
        if (index2 === 0) newVector.push(1)
        else newVector.push(0)
      })
      setResult(prev => { return { ...prev, sort: newVector, columnasHeader: ['CIP', leng.nombre, leng.edad2, leng.sexo2], columnasValue: ['cip', 'nombre', 'edad', 'sexo'] } })
      const selectedAI = []
      AI.forEach(() => selectedAI.push(0))
      setResult(prev => { return { ...prev, selectedAI } })
      newData.sort((p1, p2) => {
        return (p1.nombre > p2.nombre) ? 1 : (p1.nombre < p2.nombre) ? -1 : 0
      })
      setDataPatients(newData)
    }
  }, [dataSearch])

  const sortBy = (index) => {
    setDataPatients(prev => {
      const newData = [...prev]
      if (result.sort[index] === 0 || result.sort[index] === 2) {
        if (index > 0) {
          newData.sort((p1, p2) => {
            return (p1[result.columnasValue[index]] > p2[result.columnasValue[index]]) ? 1 : (p1[result.columnasValue[index]] < p2[result.columnasValue[index]]) ? -1 : 0
          })
        } else {
          newData.sort((p1, p2) => {
            return (p1.nombre > p2.nombre) ? 1 : (p1.nombre < p2.nombre) ? -1 : 0
          })
        }
        const newVector = [...result.sort]
        result.sort.forEach((v, index2) => {
          if (index === index2) newVector[index2] = 1
          else newVector[index2] = 0
        })
        setResult(prev => { return { ...prev, sort: newVector } })
      } else {
        if (index > 0) {
          newData.sort((p1, p2) => {
            return (p1[result.columnasValue[index]] < p2[result.columnasValue[index]]) ? 1 : (p1[result.columnasValue[index]] > p2[result.columnasValue[index]]) ? -1 : 0
          })
        } else {
          newData.sort((p1, p2) => {
            return (p1.nombre < p2.nombre) ? 1 : (p1.nombre > p2.nombre) ? -1 : 0
          })
        }
        const newVector = [...result.sort]
        result.sort.forEach((v, index2) => {
          if (index === index2) newVector[index2] = 2
          else newVector[index2] = 0
        })
        setResult(prev => { return { ...prev, sort: newVector } })
      }
      return newData
    })
  }

  const handleClickAI = (index) => {
    const selectedAI = result.selectedAI
    if (selectedAI[index] === 0) {
      selectedAI[index] = 1
      setResult(prev => {
        prev.columnasHeader.push(leng[AI[index]])
        prev.columnasValue.push(AI[index])
        let newData = [...dataPatients]
        const a = newData.map((patient) => {
          let value = '-'
          patient.inteligenciaActiva.every(ia => {
            if (ia.name === AI[index]) {
              if (ia.values.length > 0) value = ia.values.at(-1).value
              return false
            }
            return true
          })
          return { ...patient, [AI[index]]: value }
        })
        newData = [...a]
        setDataPatients(newData)
        return { ...prev, selectedAI }
      })
    } else {
      selectedAI[index] = 0
      setResult(prev => {
        const pos1 = result.columnasHeader.indexOf(AI[index])
        const arr1 = [...prev.columnasHeader]
        arr1.splice(pos1, 1)
        const pos2 = result.columnasHeader.indexOf(AI[index])
        const arr2 = [...prev.columnasValue]
        arr2.splice(pos2, 1)
        return { ...prev, selectedAI, columnasHeader: arr1, columnasValue: arr2 }
      })
    }
    const newVector = [...result.sort]
    newVector.push(0)
    setResult(prev => { return { ...prev, sort: newVector } })
  }

  const handleClickExport = (fileExtension) => {
    if (fileExtension === 'xlsx') {
      const table = document.getElementById('patientsList')
      const wb = XLSX.utils.table_to_book(table)
      XLSX.writeFile(wb, 'ListaPacientes.xlsx')
    } else {
      // eslint-disable-next-line new-cap
      const doc = new jsPDF()
      autoTable(doc, { html: '#patientsList' })
      doc.save('prueba.pdf')
    }
  }

  return (
    <>
      {searchD ? <Search type='diagnosis' submit={submitDiagnosis}/> : null}
      {searchM ? <Search type='med' submit={submitMeds}/> : null}
      <div className="lists">
        <div className="lists_container">
          <div className="lists_container_form">
            <span className='title'>{leng.parametros}</span>
            <div className="lists_container_form_dates">
              <div className="lists_container_form_dates_start">
                <label>{leng.fechaInicio}</label>
                <DatePicker maxDate={new Date()} format='dd/MM/yyyy' clearIcon={null} autoFocus={false} onChange={(e) => changeParameters(e, 'fechaInicio')} value={parameters.startDate} />
              </div>
              <div className="lists_container_form_dates_end">
                <label>{leng.fechaFinal}</label>
                <DatePicker maxDate={new Date()} format='dd/MM/yyyy' clearIcon={null} autoFocus={false} onChange={(e) => changeParameters(e, 'fechaFinal')} value={parameters.endDate} />
              </div>
            </div>
            <div className="lists_container_form_selector">
              <label>{leng.selec}</label>
              <Select currentSelect={parameters.currentSelect} handleChange={(e) => changeParameters(e, 'selector')}>
                  {
                    globalData.worker.centros.map((option, index) => {
                      return <Option key={index} option={option}></Option>
                    })
                  }
                <Option option={leng.todosLosCentros}></Option>
                <Option option={leng.todosLosPacientes}></Option>
              </Select>
            </div>
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
                      <div className="state_row">
                        <input type="radio" checked={d.statusDiagnosis === 'active'} value={leng.activo} name={'inputDiagnosisActive' + index} onChange={() => changeDiagnosis(index, 'active')} required="required"/>
                        <label>{leng.activo}</label>
                      </div>
                      <div className="state_row">
                        <input type="radio" checked={d.statusDiagnosis === 'inactive'} value={leng.inactivo} name={'inputDiagnosisInactive' + index} onChange={() => changeDiagnosis(index, 'inactive')} required="required"/>
                        <label>{leng.inactivo}</label>
                      </div>
                      <div className="state_row">
                        <input type="radio" checked={d.statusDiagnosis === 'B'} value={leng.inactivo} name={'inputDiagnosisBoth' + index} onChange={(e) => changeDiagnosis(index, 'B')} required="required"/>
                        <label>{leng.todos}</label>
                      </div>
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
                      <div className="state_row">
                        <input type="radio" checked={d.statusMed === 'active'} value={leng.activo} name={'inputMedActive' + index} onChange={() => changeMed(index, 'active')} required="required"/>
                        <label>{leng.activo}</label>
                      </div>
                      <div className="state_row">
                        <input type="radio" checked={d.statusMed === 'inactive'} value={leng.inactivo} name={'inputMedInactive' + index} onChange={() => changeMed(index, 'inactive')} required="required"/>
                        <label>{leng.inactivo}</label>
                      </div>
                      <div className="state_row">
                        <input type="radio" checked={d.statusMed === 'B'} value={leng.inactivo} name={'inputMedBoth' + index} onChange={(e) => changeMed(index, 'B')} required="required"/>
                        <label>{leng.todos}</label>
                      </div>
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
                  <div className="state_row">
                    <input type="radio" checked={parameters.sex === 'M'} value={leng.activo} name='inputM' onChange={(e) => changeParameters('M', 'sex')} required="required"/>
                    <label>{leng.masc}</label>
                  </div>
                  <div className="state_row">
                    <input type="radio" checked={parameters.sex === 'F'} value={leng.inactivo} name='inputF' onChange={(e) => changeParameters('F', 'sex')} required="required"/>
                    <label>{leng.fem}</label>
                  </div>
                  <div className="state_row">
                    <input type="radio" checked={parameters.sex === 'B'} value={leng.inactivo} name='inputB' onChange={(e) => changeParameters('B', 'sex')} required="required"/>
                    <label>{leng.todos}</label>
                  </div>
                </div>
              </div>
            </div>
            <button onClick={handleClick} id='button_submit_search' className='button_classic'>{leng.buscar}</button>
          </div>
        </div>
        {
          dataPatients
            ? <div className="lists_container">
                <div className="lists_container_result">
                  <span className='title'>{leng.listaPacientes}</span>
                  <label>{leng.resultadosFinales}</label>
                  <div className="classic_table">
                    <table>
                      <thead>
                        <tr>
                          <th>{leng.pacientes}</th>
                          <th>{leng.hombres}</th>
                          <th>{leng.mujeres}</th>
                        </tr>
                      </thead>
                      <tbody>
                      <tr>
                        <td>{dataPatients.length}</td>
                        <td>{result.numHombres}</td>
                        <td>{result.numMujeres}</td>
                      </tr>
                      </tbody>
                    </table>
                  </div>
                  <label>{leng.listaPacientes}</label>
                  <div className="selectorAI">
                  <div className="recs">
                    {
                      AI.map((ai, index) => {
                        return <div onClick={() => handleClickAI(index)} key={index} className={result.selectedAI[index] === 0 ? 'rec' : 'rec selected'}>{leng[ai]}</div>
                      })
                    }
                  </div>
                  </div>
                  <div className="exportButtons hide-for-desktop">
                    <button className='excelButton' onClick={() => handleClickExport('xlsx')}><FontAwesomeIcon className='icon' icon={faFileExcel}/></button>
                    <button className='pdfButton' onClick={() => handleClickExport('pdf')}><FontAwesomeIcon className='icon' icon={faFilePdf}/></button>
                  </div>
                  <div className="table" id='table'>
                    <div className="exportButtons hide-for-mobile">
                      <button className='excelButton' onClick={() => handleClickExport('xlsx')}><FontAwesomeIcon className='icon' icon={faFileExcel}/></button>
                      <button className='pdfButton' onClick={() => handleClickExport('pdf')}><FontAwesomeIcon className='icon' icon={faFilePdf}/></button>
                    </div>
                    <table id='patientsList'>
                      <tbody>
                      <tr>
                        {
                          result.columnasHeader.map((c, index) => {
                            if (c === 'nombre') return <th><div className="th_value"><p>Nombre completo</p><FontAwesomeIcon onClick={() => sortBy(index)} className='icon' icon={result.sort[index] === 1 ? faArrowDownWideShort : faArrowDownShortWide}/></div></th>
                            return (
                              <th key={index}><div className="th_value"><p>{c}</p><FontAwesomeIcon onClick={() => sortBy(index)} className='icon' icon={result.sort[index] === 1 ? faArrowDownWideShort : faArrowDownShortWide}/></div></th>
                            )
                          })
                        }
                      </tr>
                      {
                        dataPatients.map((patient, index) => {
                          return (
                            <tr key={index} className={index % 2 ? 'pair' : null}>
                              {
                                result.columnasValue.map((c) => {
                                  if (c === 'nombre') return <td key={`${patient.cip}_${c}`}><a href={'/app/patients/' + patient._id}>{getName(patient.nombre, patient.apellido1, patient.apellido2)}</a></td>
                                  return (
                                    <td key={`${patient.cip}_${c}`}><a href={'/app/patients/' + patient._id}>{patient[c]}</a></td>
                                  )
                                })
                              }
                            </tr>
                          )
                        })
                      }
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            : null
        }
      </div>
    </>
  )
}

export default ListsContainer
