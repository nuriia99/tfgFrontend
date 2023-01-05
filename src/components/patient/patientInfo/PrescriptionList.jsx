import { React, useState, useEffect } from 'react'
import { useGlobalContext } from '../../../hooks/useGlobalContext'
import { usePatientContext } from '../../../hooks/usePatientContext'
import { getLenguage } from '../../../utils/lenguage'
import PrescriptionRow from './PrescriptionRow'
import useDelete from '../../../hooks/useDelete'
import AddPrescription from './AddPrescription'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCapsules, faCircleExclamation } from '@fortawesome/free-solid-svg-icons'

// patient={{ allergy: globalData.patient.inteligenciaActiva.alergias, prescriptions: globalData.patient.prescripciones }}
const PrescriptionList = () => {
  const { globalData } = useGlobalContext()
  const { patientData, updatePatient } = usePatientContext()
  const leng = getLenguage(globalData.lenguage, 'patient')
  const allergy = patientData.patient.inteligenciaActiva.at(-1).at(-1)
  const currentDate = new Date()
  const [prescriptions, setPrescriptions] = useState()
  const [deleteIndex, setDeleteIndex] = useState()

  useEffect(() => {
    setPrescriptions(() => {
      return patientData.patient.prescripciones.filter((prescription) => {
        return new Date(prescription.fechaFinal).getTime() > currentDate.getTime()
      })
    })
  }, [])

  useEffect(() => {
    setPrescriptions(() => {
      return patientData.patient.prescripciones.filter((prescription) => {
        return new Date(prescription.fechaFinal).getTime() > currentDate.getTime()
      })
    })
  }, [patientData])

  const { deleteData: delPres, data: dataDelete } = useDelete()

  const deletePres = () => {
    const index = deleteIndex
    delPres('/prescriptions/deletePrescription/' + prescriptions[index]._id, { worker: globalData.worker._id, centre: globalData.center, removedPrincipioActivo: prescriptions[index].principioActivo, patient: prescriptions[index].paciente })
    setPrescriptions((prev) => {
      const arr = [...prev]
      arr.splice(index, 1)
      const newPatient = { ...patientData.patient }
      newPatient.prescripciones = arr
      updatePatient({ patient: newPatient })
      return arr
    })
    setDeleteIndex()
  }

  useEffect(() => {
    if (dataDelete) console.log(dataDelete)
  }, [dataDelete])

  const [modifyingPres, setModifyingPres] = useState()

  const modPres = (prescription) => {
    setModifyingPres(prescription)
  }

  const quitAddPrescription = () => {
    setModifyingPres()
    setShowAddPrescription(false)
  }

  const [showAddPrescription, setShowAddPrescription] = useState(false)

  return (
    <>
      <div className="prescriptions">
        {
            deleteIndex || deleteIndex === 0
              ? <>
                <div className="overlay">
                  <div className="overlay_box">
                    <FontAwesomeIcon icon={faCircleExclamation} className='icon'/>
                    <p>{leng.seguroPrescripcion}</p>
                    <div className="overlay_box_buttons">
                      <button type='button' onClick={deletePres} className='button_classic accept'>Eliminar</button>
                      <button type='button' onClick={() => setDeleteIndex()} className='button_classic cancel'>{leng.cancelar}</button>
                    </div>
                  </div>
                </div>
              </>
              : null
          }
        <div className="prescriptions_container">
          {
            !showAddPrescription
              ? <>
                {
                  modifyingPres
                    ? <AddPrescription quitAddPrescription={quitAddPrescription} modifying={modifyingPres}/>
                    : <>
                      <div className="prescriptions_container_info">
                        <div className="prescriptions_container_info_title">
                          {leng.alergias + ': '}
                        </div>
                        {allergy}
                      </div>
                      <div className="prescriptions_container_button"><button className='capsules_button' onClick={() => { setShowAddPrescription(true) }}><FontAwesomeIcon className='icon' icon={faCapsules}/></button></div>
                      <div className="prescriptions_container_table">
                        {
                          prescriptions // check prescriptions
                            ? <>
                            <div className="classic_table">
                              <table>
                                <thead>
                                  <tr>
                                    <th>{leng.nombreMedicamento}</th>
                                    <th>{leng.principioActivo}</th>
                                    <th className='small'>{leng.frecuencia}</th>
                                    <th className='small'>{leng.duracion}</th>
                                    <th className='small'></th>
                                  </tr>
                                </thead>
                                <tbody>
                                {
                                  prescriptions.map((prescription, index) => {
                                    return (
                                      <PrescriptionRow key={index} prescription={prescription} deletePres={() => { setDeleteIndex(index) }} modPres={() => { modPres(prescription) }}/>
                                    )
                                  })
                                }
                                </tbody>
                              </table>
                              {
                                prescriptions.length < 1
                                  ? <>
                                    <div className='empty'>{leng.empty}</div>
                                  </>
                                  : null
                              }
                            </div>
                            </>
                            : null
                        }
                      </div>
                  </>
                }
              </>
              : <AddPrescription quitAddPrescription={quitAddPrescription}/>
          }
        </div>
      </div>
    </>
  )
}

export default PrescriptionList
