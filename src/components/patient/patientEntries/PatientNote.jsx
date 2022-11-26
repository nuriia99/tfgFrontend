import { React } from 'react'
import _ from 'lodash'

const PatientNote = ({ note, clickNote }) => {
  return (
    <>
      <div onClick={clickNote} className="note">
        <div className="note_diagnosis">{_.toUpper(note.diagnostico.nombre)}</div>
        {
          note.motivo
            ? <div className="note_row">
                <div className="note_row_letter">M</div>
                <div className="note_row_content">{note.motivo}</div>
              </div>
            : null
        }
        {
          note.antecedentes
            ? <div className="note_row">
                <div className="note_row_letter">A</div>
                <div className="note_row_content">{note.antecedentes}</div>
              </div>
            : null
        }
        {
          note.clinica
            ? <div className="note_row">
                <div className="note_row_letter">C</div>
                <div className="note_row_content">{note.clinica}</div>
              </div>
            : null
        }
        {
          note.exploracion
            ? <div className="note_row">
                <div className="note_row_letter">E</div>
                <div className="note_row_content">{note.exploracion}</div>
              </div>
            : null
        }
        {
          note.pruebasComplementarias
            ? <div className="note_row">
                <div className="note_row_letter">PC</div>
                <div className="note_row_content">{note.pruebasComplementarias}</div>
              </div>
            : null
        }
        {
          note.descDiagnostico
            ? <div className="note_row">
                <div className="note_row_letter">D</div>
                <div className="note_row_content">{note.descDiagnostico}</div>
              </div>
            : null
        }
        {
          note.planTerapeutico
            ? <div className="note_row">
                <div className="note_row_letter">P</div>
                <div className="note_row_content">{note.planTerapeutico}</div>
              </div>
            : null
        }
      </div>
    </>
  )
}

export default PatientNote
