import { React } from 'react'

const PrescriptionCard = ({ handleClickPrincipalComponent }) => {
  return (
    <>
      <button id='prescription_button' name='prescription_button' onClick={handleClickPrincipalComponent} className='button_classic'>Ver todas las prescripciones</button>
    </>
  )
}

export default PrescriptionCard
