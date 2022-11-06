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
