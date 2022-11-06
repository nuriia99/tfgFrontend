import { React } from 'react'

const PrescriptionCard = ({ handleClickPrincipalComponent }) => {
  return (
    <>
      <button name='prescription_button' onClick={handleClickPrincipalComponent} className='button_classic'>Ver todas las prescripciones</button>
    </>
  )
}

export default PrescriptionCard
