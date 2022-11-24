import { React, useState, useEffect } from 'react'
import { useGlobalContext } from '../../../hooks/useGlobalContext'
import { usePatientContext } from '../../../hooks/usePatientContext'
import { getLenguage } from '../../../utils/lenguage'
import PrescriptionRow from './PrescriptionRow'
import useDelete from '../../../hooks/useDelete'

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
    delPres('/prescriptions/deletePrescription/' + prescriptions[index]._id)
    setPrescriptions((prev) => {
      const arr = [...prev]
      arr.splice(index, 1)
      const newPatient = { ...patientData.patient }
      newPatient.prescripciones = arr
      updatePatient(newPatient)
      return arr
    })
  }

  useEffect(() => {
    if (dataDelete) console.log(dataDelete)
  }, [dataDelete])

  return (
    <>
      <div className="prescriptions">
        <div className="prescriptions_container">
          <div className="prescriptions_container_info">
            <div className="prescriptions_container_info_title">
              {leng.alergias + ': '}
            </div>
            {allergy}
          </div>
          <div className="prescriptions_container_table">
            <div className="table">
              <div className="table_row">
                <div className="table_row_title name">{leng.nombreMedicamento}</div>
                <div className="table_row_title component">{leng.principioActivo}</div>
                <div className="table_row_title frecuencia">{leng.frecuencia}</div>
                <div className="table_row_title duracion">{leng.duracion}</div>
                <div className="table_row_title delete"></div>
              </div>
              {
                prescriptions
                  ? <>
                  {
                    prescriptions.map((prescription, index) => {
                      return (
                        <div key={index} className="table_row">
                          <PrescriptionRow prescription={prescription} deletePres={() => { deletePres(index) }}/>
                        </div>
                      )
                    })
                  }
                  </>
                  : null
              }
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PrescriptionList
