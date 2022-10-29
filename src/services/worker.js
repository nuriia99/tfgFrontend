import axios from 'axios'

export const updateLenguage = async ({ id, token, lenguage }) => {
  try {
    const res = await axios.post('/trabajadores/' + id + '/updateLenguage', { lenguage }, {
      headers: {
        Authoritation: `Bearer ${token}`
      }
    })
    return res
  } catch (error) {
    return error.response.status
  }
}
