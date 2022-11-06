import axios from 'axios'

export const updateLenguage = async ({ id, token, lenguage }) => {
  try {
    const res = await axios.post('/trabajadores/' + id + '/updateLenguage', { lenguage }, {
      headers: {
        authorization: `Bearer ${token}`
      }
    })
    return res
  } catch (error) {
    return error.response.status
  }
}

export const getWorkerName = async ({ id, token }) => {
  try {
    const res = await axios.get('/trabajadores/' + id + '/getName', {
      headers: {
        authorization: `Bearer ${token}`
      }
    })
    return res.data
  } catch (error) {
    return error
  }
}
