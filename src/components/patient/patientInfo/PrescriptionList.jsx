import { React, useState, useEffect } from 'react'
import { useGlobalContext } from '../../../hooks/useGlobalContext'
import { usePatientContext } from '../../../hooks/usePatientContext'
import { getLenguage } from '../../../utils/lenguage'
import PrescriptionRow from './PrescriptionRow'
import useDelete from '../../../hooks/useDelete'
import AddPrescription from './AddPrescription'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCapsules } from '@fortawesome/free-solid-svg-icons'

// patient={{ allergy: globalData.patient.inteligenciaActiva.alergias, prescriptions: globalData.patient.prescripciones }}
const PrescriptionList = () => {
  const { globalData } = useGlobalContext()
  const { patientData, updatePatient } = usePatientContext()
  const leng = getLenguage(globalData.lenguage, 'patient')
  const allergy = patientData.patient.inteligenciaActiva.at(-1).at(-1)
  const currentDate = new Date()
  const [prescriptions, setPrescriptions] = useState()

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

  const deletePres = (index) => {
    delPres('/prescriptions/deletePrescription/' + prescriptions[index]._id, { worker: globalData.worker._id, centre: globalData.center, removedPrincipioActivo: prescriptions[index].principioActivo, patient: prescriptions[index].paciente })
    setPrescriptions((prev) => {
      const arr = [...prev]
      arr.splice(index, 1)
      const newPatient = { ...patientData.patient }
      newPatient.prescripciones = arr
      updatePatient(newPatient)
      return arr
    })
  }

  console.log(prescriptions)

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
                      <div className="prescriptions_container_table crossbar">
                        <div className="table">
                          <div className="table_row">
                            <div className="table_row_title name">{leng.nombreMedicamento}</div>
                            <div className="table_row_title component">{leng.principioActivo}</div>
                            <div className="table_row_title frecuencia">{leng.frecuencia}</div>
                            <div className="table_row_title duracion">{leng.duracion}</div>
                            <div className="table_row_title delete"></div>
                          </div>
                        </div>
                        <div className="table">
                          {
                            prescriptions
                              ? <>
                              {
                                prescriptions.map((prescription, index) => {
                                  return (
                                    <div key={index} className="table_row">
                                      <PrescriptionRow prescription={prescription} deletePres={() => { deletePres(index) }} modPres={() => { modPres(prescription) }}/>
                                    </div>
                                  )
                                })
                              }
                              </>
                              : null
                          }
                        </div>
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
