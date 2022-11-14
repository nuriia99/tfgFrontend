import { React } from 'react'
const PatientInfoItem = ({ title, value }) => {
  return (
    <div className="patient_info_line">
      <p className='title'>{title}</p>
      <p className='value'>{value}</p>
    </div>
  )
}

export default PatientInfoItem
