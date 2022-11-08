import { React } from 'react'
import { useParams } from 'react-router-dom'

const PDFFile = () => {
  return (
    <div className="document">
      <div style={{ position: 'absolute', width: '100%', height: '100%' }}>
        <object data={require('../../docs/' + useParams().name)}
        type='application/pdf'
        width='100%'
        height='100%' >
        </object>
      </div>
    </div>
  )
}

export default PDFFile
