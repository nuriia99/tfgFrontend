import { React } from 'react'
import _ from 'lodash'

const PatientNote = ({ note, clickNote }) => {
  return (
    <>
      <div onClick={clickNote} className="note">
        <div className="note_diagnosis">{_.toUpper(note.diagnostico.nombre)}</div>
        <div className="note_row">
          <div className="note_row_letter">A</div>
          <div className="note_row_content">{note.asunto}</div>
        </div>
        <div className="note_row">
          <div className="note_row_letter">E</div>
          <div className="note_row_content">{note.exploracion}</div>
        </div>
        <div className="note_row">
          <div className="note_row_letter">T</div>
          <div className="note_row_content">{note.tratamiento}</div>
        </div>
      </div>
    </>
  )
}

export default PatientNote
