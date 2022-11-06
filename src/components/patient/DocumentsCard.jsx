import { React } from 'react'

const DocumentsCard = ({ handleClickPrincipalComponent }) => {
  return (
    <>
      <button name='documents_button' onClick={handleClickPrincipalComponent} className='button_classic'>Ver todos los documentos</button>
    </>
  )
}

export default DocumentsCard
