import axios from 'axios'

export const getEntries = async ({ id, token }) => {
  try {
    const res = await axios.get('/entries/patient/' + id, {
      headers: {
        authorization: `Bearer ${token}`
      }
    })
    return res.data
  } catch (error) {
    return error
  }
}

export const translateNotes = async ({ notes, lengWorker }) => {
  try {
    const newNotes = await Promise.all(
      notes.map(async (note) => {
        const asunto = await axios.get('https://api.mymemory.translated.net/get?q=' + note.asunto + '!&langpair=es|ca&de=whisper.gamer.pro@gmail.com')
        const exploracion = await axios.get('https://api.mymemory.translated.net/get?q=' + note.exploracion + '!&langpair=es|ca&de=whisper.gamer.pro@gmail.com')
        const tratamiento = await axios.get('https://api.mymemory.translated.net/get?q=' + note.tratamiento + '!&langpair=es|ca&de=whisper.gamer.pro@gmail.com')

        const newNote = { ...note }
        newNote.asunto = asunto.data.responseData.translatedText.substring(0, asunto.data.responseData.translatedText.length - 1).replace(/&#39;/g, '\'')
        newNote.exploracion = exploracion.data.responseData.translatedText.substring(0, exploracion.data.responseData.translatedText.length - 1).replace(/&#39;/g, '\'')
        newNote.tratamiento = tratamiento.data.responseData.translatedText.substring(0, tratamiento.data.responseData.translatedText.length - 1).replace(/&#39;/g, '\'')
        return newNote
      })
    )
    // const newEntries = await Promise.all(
    //   entries.map(async (entry) => {
    //     if (leng !== entry.lenguaje) {
    //       const newEntry = entry
    //       const newNotes = []
    //       await Promise.all(
    //         entry.notas.map(async (note) => {
    //           // const asunto = await axios.get('https://api.mymemory.translated.net/get?q=' + note.asunto + '!&langpair=es|ca&de=whisper.gamer.pro@gmail.com')
    //           const asunto = 'a'
    //           const newNote = note
    //           // newNote.asunto = asunto.data.responseData.translatedText
    //           newNote.asunto = asunto
    //           newNotes.push(newNote)
    //         })
    //       )
    //       newEntry.notas = newNotes
    //       console.log(newEntry)
    //       return newEntry
    //     } else return entry
    //   })
    // )
    return newNotes
  } catch (error) {
    return error
  }
}
