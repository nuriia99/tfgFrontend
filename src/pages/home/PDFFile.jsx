import { React } from 'react'

const PDFFile = ({ file }) => {
  return (
    <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
      <object data={require('../../docs/Informe1.pdf')}
      type='application/pdf'
      width='100%'
      height='100%' >
      </object>
    </div>
  )
}

export default PDFFile
